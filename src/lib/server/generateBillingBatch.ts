import { inspect } from 'node:util';
import { calculateLessonQuery, lastInvoiceQuery, prisma } from './db';
import { wrapErr, wrapOk } from '$lib/rustResult';
import { ACCOUNT_TRANSACTION_TYPE, LEDGER_CODE } from '../defs';
import { calculateLessonCost } from '$lib/calculateLessonCost';

type NewInvoice = {
	InvoiceLineItems: {
		id: string;
		date: Date;
		description: string;
		amountInCents: number;
	}[];
} & {
	id: string;
	invoiceDate: Date;
	skaterId: string;
	invoiceBatchId: string | null;
};

export function formatSkaterLineItemDescription(
	numberOfSkaters: number,
	lessonTimeInMinutes: number,
	coachName: string
): string {
	if (numberOfSkaters === 1) {
		return `${lessonTimeInMinutes} minute private lesson (${coachName})`;
	}
	return `${lessonTimeInMinutes} minute group (${numberOfSkaters} skaters) lesson (${coachName})`;
}

function log(input: Parameters<typeof inspect>[0]) {
	console.log(inspect(input, false, null, true));
}

export async function generateBillingBatch(invoiceDate: Date = new Date()) {
	return prisma.$transaction(async (tx) => {
		// Get Skater Lessons
		const skatersUnInvoicedLessons = await tx.skater.findMany({
			include: {
				Invoices: lastInvoiceQuery,
				Account: {
					include: {
						AccountTransaction: {
							where: {
								accountTransactionTypeCode: ACCOUNT_TRANSACTION_TYPE.STUDENT_PAYMENT,
								PaymentRecordedInvoice: { is: null }
							}
						}
					}
				},
				SkaterLessons: {
					select: {
						Lesson: calculateLessonQuery
					},
					where: { InvoiceLineItems: { is: null } }
				}
			}
		});

		const billingBatch = await tx.billingBatch.create({ data: {} });

		const invoices: NewInvoice[] = [];
		for (const skater of skatersUnInvoicedLessons) {
			const skaterId = skater.id;
			if (skater.SkaterLessons.length === 0) {
				continue;
			}
			const lastInvoice = skater.Invoices[0];

			const lineItemsData = skater.SkaterLessons.map(
				({
					Lesson: {
						id: lessonId,
						date: lessonDate,
						lessonTimeInMinutes,
						_count: { SkaterLessons: numberOfSkaters },
						SkaterLessons,
						Coach: {
							CoachRate,
							User: { firstName: coachFirstName, lastName: coachLastName }
						}
					}
				}) => {
					const skaters = SkaterLessons.map((entry) => {
						return { skaterId: entry.skaterId, skaterTypeCode: entry.Skater.skaterTypeCode };
					});
					const { skatersWithCost } = calculateLessonCost(lessonTimeInMinutes, CoachRate, skaters);
					const amountInCents = skatersWithCost.find(
						(entry) => entry.skaterId === skater.id
					)?.amountInCents;
					return {
						skaterLessonSkaterId: skaterId,
						skaterLessonLessonId: lessonId,
						amountInCents: amountInCents ?? 0, //TODO figure out better validation
						date: lessonDate,
						description: formatSkaterLineItemDescription(
							numberOfSkaters,
							lessonTimeInMinutes,
							`${coachFirstName} ${coachLastName}`
						)
					};
				}
			);

			const chargesTotalInCents = lineItemsData.reduce(
				(acc, { amountInCents }) => acc + amountInCents,
				0
			);

			const paymentsTotal = skater.Account.AccountTransaction.reduce(
				(acc, { amountInCents }) => acc + amountInCents,
				0
			);

			const previousAmountDueInCents = lastInvoice?.amountDueInCents ?? 0;
			const outstandingBalanceInCents = previousAmountDueInCents - paymentsTotal;
			const amountDueInCents = outstandingBalanceInCents + chargesTotalInCents;

			const newInvoice = await tx.invoice.create({
				data: {
					invoiceBatchId: billingBatch.id,
					skaterId: skater.id,
					invoiceDate,
					amountDueInCents,
					outstandingBalanceInCents,
					previousAmountDueInCents: lastInvoice?.amountDueInCents ?? 0,
					chargesTotalInCents,
					previousInvoiceId: lastInvoice?.id,
					InvoiceLineItems: {
						createMany: {
							data: lineItemsData
						}
					},
					SkaterPaymentAccountTransactions: {
						connect: skater.Account.AccountTransaction.map(({ id }) => ({ id }))
					},
					InvoiceChargeAccountTransaction: {
						create: {
							accountId: skater.accountId,
							amountInCents: chargesTotalInCents,
							accountTransactionTypeCode: ACCOUNT_TRANSACTION_TYPE.STUDENT_CHARGE,
							LedgerTransaction: {
								create: {
									amountInCents: chargesTotalInCents,
									debitLedgerCode: LEDGER_CODE.ACCOUNTS_RECEIVABLE,
									creditLedgerCode: LEDGER_CODE.INVOICING
								}
							}
						}
					}
				},
				include: {
					InvoiceLineItems: {
						select: { id: true, description: true, amountInCents: true, date: true }
					}
				}
			});

			invoices.push(newInvoice);
		}
		if (invoices.length === 0) {
			await tx.billingBatch.delete({ where: { id: billingBatch.id } });
			return wrapErr({ message: 'No un-invoiced Skater Lessons found' });
		}

		const coaches = await tx.coach.findMany({
			include: {
				CoachRate: true,
				CoachPaySlips: { where: { NextCoachPaySlip: { is: null } }, take: 1 },
				Account: {
					include: {
						AccountTransaction: {
							where: {
								accountTransactionTypeCode: ACCOUNT_TRANSACTION_TYPE.COACH_PAYMENT,
								CoachPaymentPaySlip: { is: null }
							}
						}
					}
				},

				Lessons: {
					include: {
						SkaterLessons: { include: { Skater: { select: { id: true, skaterTypeCode: true } } } }
					},
					where: { CoachPaySlipLineItem: { is: null } }
				}
			}
		});

		for (const coach of coaches) {
			if (coach.Lessons.length === 0) {
				continue;
			}
			// calculate the total lessons

			const chargesTotalInCents = coach.Lessons.reduce(
				(acc, { lessonTimeInMinutes, SkaterLessons }) => {
					const skaters = SkaterLessons.map((entry) => {
						return {
							skaterId: entry.skaterId,
							skaterTypeCode: entry.Skater.skaterTypeCode
						};
					});
					const { lessonCostInCents } = calculateLessonCost(
						lessonTimeInMinutes,
						coach.CoachRate,
						skaters
					);
					acc += lessonCostInCents;
					return acc;
				},
				0
			);

			const previousPaySlip = coach.CoachPaySlips[0];
			const previousPaySlipAmountInCents = previousPaySlip?.amountDueInCents ?? 0;

			const coachPaymentAccountTransactions = coach.Account.AccountTransaction;
			const paymentsTotal = coachPaymentAccountTransactions.reduce(
				(acc, { amountInCents }) => acc + amountInCents,
				0
			);

			const commissionPercentage = coach.commissionPercentage;
			const coachRevenueInCents = ((100 - commissionPercentage) / 100) * chargesTotalInCents;
			const commissionAmountInCents = (commissionPercentage / 100) * chargesTotalInCents;

			if (coachRevenueInCents + commissionAmountInCents !== chargesTotalInCents) {
				log({
					lessonSum: chargesTotalInCents,
					coachIncome: coachRevenueInCents,
					commissionRevenue: commissionAmountInCents
				});
				throw new Error('Commision Calculation Error');
			}
			const outstandingBalanceInCents = previousPaySlipAmountInCents - paymentsTotal;
			const amountDueInCents = coachRevenueInCents + outstandingBalanceInCents;

			await tx.coachPaySlip.create({
				data: {
					billingBatchId: billingBatch.id,
					previousCoachPaySlipId: previousPaySlip?.id,
					coachId: coach.id,
					amountDueInCents,
					coachRevenueInCents,
					chargesTotalInCents,
					commissionAmountInCents,
					outstandingBalanceInCents,
					previousPaySlipAmountInCents,
					CoachPaySlipLineItems: {
						createMany: {
							data: coach.Lessons.map(
								({ date, id: lessonId, lessonTimeInMinutes, SkaterLessons }) => {
									const skaters = SkaterLessons.map((entry) => {
										return {
											skaterId: entry.skaterId,
											skaterTypeCode: entry.Skater.skaterTypeCode
										};
									});
									const { lessonCostInCents } = calculateLessonCost(
										lessonTimeInMinutes,
										coach.CoachRate,
										skaters
									);
									return {
										date,
										lessonId,
										amountInCents: lessonCostInCents,
										description: `${lessonTimeInMinutes} minute lesson. ${SkaterLessons.length} skater(s)`
									};
								}
							)
						}
					},
					PaySlipChargeAccountTransaction: {
						create: {
							amountInCents: coachRevenueInCents,
							accountId: coach.accountId,
							accountTransactionTypeCode: ACCOUNT_TRANSACTION_TYPE.COACH_CHARGE,
							LedgerTransaction: {
								create: {
									amountInCents: coachRevenueInCents,
									debitLedgerCode: LEDGER_CODE.INVOICING,
									creditLedgerCode: LEDGER_CODE.ACCOUNTS_PAYABLE
								}
							}
						}
					}
				}
			});

			// TODO: maybe update schema to directly connect this to a coach pay slip
			// Commission Revenue
			if (commissionAmountInCents > 0) {
				await tx.ledgerTransaction.create({
					data: {
						amountInCents: commissionAmountInCents,
						debitLedgerCode: LEDGER_CODE.INVOICING,
						creditLedgerCode: LEDGER_CODE.COMMISSION
					}
				});
			}
		}

		const populatedBillingBatch = await tx.billingBatch.findUniqueOrThrow({
			where: { id: billingBatch.id },
			include: {
				Invoices: {
					include: {
						InvoiceLineItems: true,
						Skater: { select: { firstName: true, lastName: true } }
					}
				}
			}
		});

		return wrapOk(populatedBillingBatch);
	});
	/*


	const populatedBillingBatch = await prisma.billingBatch.findUniqueOrThrow({
		where: { id: billingBatch.id },
		include: {
			Invoices: {
				include: { InvoiceLineItems: true, Skater: { select: { firstName: true, lastName: true } } }
			}
		}
	});

	return wrapOk(populatedBillingBatch);
    */
}
