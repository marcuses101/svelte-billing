import { ACCOUNT_TRANSACTION_TYPE, LEDGER_CODE } from '../defs';
import { calculateLessonCost } from '$lib/calculateLessonCost';
import type { Prisma } from '@prisma/client';
import { prettyLog } from './prettyLog';
import { HST_PERCENTAGE } from './shared';

function getCoachesWithInfoForPayslip(tx: Prisma.TransactionClient) {
	return tx.coach.findMany({
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
}

function processCoachForPaySlip(
	coach: Awaited<ReturnType<typeof getCoachesWithInfoForPayslip>>[number]
) {
	// calculate the total lessons
	const { chargesTotalInCents, coachPaySlipLineItems } = coach.Lessons.reduce(
		(acc, { date, id: lessonId, lessonTimeInMinutes, SkaterLessons }) => {
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
			acc.chargesTotalInCents += lessonCostInCents;
			acc.coachPaySlipLineItems.push({
				date,
				lessonId,
				amountInCents: lessonCostInCents,
				description: `${lessonTimeInMinutes} minute lesson. ${SkaterLessons.length} skater(s)`
			});
			return acc;
		},
		{
			chargesTotalInCents: 0,
			coachPaySlipLineItems: [] as {
				date: Date;
				lessonId: string;
				amountInCents: number;
				description: string;
			}[]
		}
	);

	const previousPaySlip = coach.CoachPaySlips[0];
	const previousPaySlipAmountInCents = previousPaySlip?.amountDueInCents ?? 0;

	const coachPaymentAccountTransactions = coach.Account.AccountTransaction;
	const paymentsTotal = coachPaymentAccountTransactions.reduce(
		(acc, { amountInCents }) => acc + amountInCents,
		0
	);

	// TODO review these calculations
	const commissionPercentage = coach.commissionPercentage;
	const coachRevenueInCents = ((100 - commissionPercentage) / 100) * chargesTotalInCents;
	const commissionAmountInCents = (commissionPercentage / 100) * chargesTotalInCents;
	const hstAmountInCents = coach.isHstCharged
		? Math.round(coachRevenueInCents * (HST_PERCENTAGE / 100))
		: 0;
	if (coachRevenueInCents + commissionAmountInCents !== chargesTotalInCents) {
		prettyLog({
			lessonSum: chargesTotalInCents,
			coachIncome: coachRevenueInCents,
			commissionRevenue: commissionAmountInCents
		});
		throw new Error('Commision Calculation Error');
	}
	const outstandingBalanceInCents = previousPaySlipAmountInCents - paymentsTotal;
	const amountDueInCents = coachRevenueInCents + outstandingBalanceInCents;
	return {
		hstAmountInCents,
		commissionAmountInCents,
		outstandingBalanceInCents,
		amountDueInCents,
		previousCoachPaySlipId: previousPaySlip?.id,
		coachRevenueInCents,
		chargesTotalInCents,
		previousPaySlipAmountInCents,
		coachPaySlipLineItems
	};
}

export async function generateCoachPaySlips(tx: Prisma.TransactionClient, billingBatchId: string) {
	const coaches = await getCoachesWithInfoForPayslip(tx);

	for (const coach of coaches) {
		if (coach.Lessons.length === 0) {
			continue;
		}
		const {
			amountDueInCents,
			hstAmountInCents,
			commissionAmountInCents,
			previousCoachPaySlipId,
			coachRevenueInCents,
			chargesTotalInCents,
			outstandingBalanceInCents,
			previousPaySlipAmountInCents,
			coachPaySlipLineItems
		} = processCoachForPaySlip(coach);

		const paySlip = await tx.coachPaySlip.create({
			data: {
				billingBatchId: billingBatchId,
				previousCoachPaySlipId,
				coachId: coach.id,
				amountDueInCents,
				hstAmountInCents,
				coachRevenueInCents,
				chargesTotalInCents,
				commissionAmountInCents,
				outstandingBalanceInCents,
				previousPaySlipAmountInCents,
				CoachPaySlipLineItems: {
					createMany: {
						data: coachPaySlipLineItems
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
		if (commissionAmountInCents > 0) {
			await tx.ledgerTransaction.create({
				data: {
					amountInCents: commissionAmountInCents,
					debitLedgerCode: LEDGER_CODE.INVOICING,
					creditLedgerCode: LEDGER_CODE.COMMISSION,
					AssociatedCommissionPaySlip: { connect: { id: paySlip.id } }
				}
			});
		}
		// should hst be calculated before or after?
		if (hstAmountInCents > 0) {
			await tx.ledgerTransaction.create({
				data: {
					amountInCents: hstAmountInCents,
					debitLedgerCode: LEDGER_CODE.INVOICING_HST,
					creditLedgerCode: LEDGER_CODE.COACH_HST
				}
			});
		}
	}
}
