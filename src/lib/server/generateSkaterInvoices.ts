import { calculateLessonQuery, lastInvoiceQuery } from './db';
import { ACCOUNT_TRANSACTION_TYPE, LEDGER_CODE } from '../defs';
import { calculateLesson } from '$lib/calculateLessonCost';
import type { Prisma } from '@prisma/client';
import { HST_PERCENTAGE } from './shared';

export type NewInvoice = {
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

function getSkatersWithUninvoicedLessons(tx: Prisma.TransactionClient) {
	return tx.skater.findMany({
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
}

function processSkaterInfoForInvoice(
	skaterWithLessons: Awaited<ReturnType<typeof getSkatersWithUninvoicedLessons>>[number]
) {
	const lastInvoice = skaterWithLessons.Invoices[0];
	const lineItemsData = skaterWithLessons.SkaterLessons.map(({ Lesson }) => {
		const {
			id: lessonId,
			date: lessonDate,
			lessonTimeInMinutes,
			_count: { SkaterLessons: numberOfSkaters },
			Coach: {
				User: { firstName: coachFirstName, lastName: coachLastName }
			}
		} = Lesson;
		const { skatersWithCost } = calculateLesson(Lesson);
		const currentSkaterCost = skatersWithCost.find(
			(entry) => entry.skaterId === skaterWithLessons.id
		);
		if (!currentSkaterCost) {
			throw new Error(`Skater with id ${skaterWithLessons.id} not found for lesson ${Lesson.id}`);
		}
		const { amountInCents } = currentSkaterCost;

		const description = formatSkaterLineItemDescription(
			numberOfSkaters,
			lessonTimeInMinutes,
			`${coachFirstName} ${coachLastName}`
		);

		return {
			skaterLessonSkaterId: skaterWithLessons.id,
			skaterLessonLessonId: lessonId,
			amountInCents,
			date: lessonDate,
			description
		};
	});

	const chargesTotalInCents = lineItemsData.reduce(
		(acc, { amountInCents }) => acc + amountInCents,
		0
	);
	const hstAmountInCents = Math.round(chargesTotalInCents * (HST_PERCENTAGE / 100));

	const paymentsTotal = skaterWithLessons.Account.AccountTransaction.reduce(
		(acc, { amountInCents }) => acc + amountInCents,
		0
	);

	const previousAmountDueInCents = lastInvoice?.amountDueInCents ?? 0;
	const outstandingBalanceInCents = previousAmountDueInCents - paymentsTotal;
	const taxedChargesInCents = chargesTotalInCents + hstAmountInCents;
	const amountDueInCents = outstandingBalanceInCents + chargesTotalInCents + hstAmountInCents;

	return {
		skaterId: skaterWithLessons.id,
		lineItemsData,
		chargesTotalInCents,
		hstAmountInCents,
		paymentsTotal,
		previousAmountDueInCents,
		outstandingBalanceInCents,
		taxedChargesInCents,
		amountDueInCents
	};
}

export async function generateSkaterInvoices(
	tx: Prisma.TransactionClient,
	invoiceDate: Date,
	billingBatchId: string
) {
	const skatersUnInvoicedLessons = await getSkatersWithUninvoicedLessons(tx);
	const invoices: NewInvoice[] = [];
	for (const skater of skatersUnInvoicedLessons) {
		if (skater.SkaterLessons.length === 0) {
			continue;
		}
		const lastInvoice = skater.Invoices[0];

		const {
			lineItemsData,
			chargesTotalInCents,
			hstAmountInCents,
			amountDueInCents,
			taxedChargesInCents,
			outstandingBalanceInCents,
			skaterId
		} = processSkaterInfoForInvoice(skater);

		// remove hst from the invoices ledger
		const hstLedgerTransaction = await tx.ledgerTransaction.create({
			data: {
				amountInCents: hstAmountInCents,
				debitLedgerCode: LEDGER_CODE.INVOICING,
				creditLedgerCode: LEDGER_CODE.INVOICING_HST
			}
		});

		const newInvoice = await tx.invoice.create({
			data: {
				invoiceBatchId: billingBatchId,
				skaterId,
				invoiceDate,
				amountDueInCents,
				outstandingBalanceInCents,
				previousAmountDueInCents: lastInvoice?.amountDueInCents ?? 0,
				chargesTotalInCents,
				hstAmountInCents,
				previousInvoiceId: lastInvoice?.id,
				hstLedgerTransactionId: hstLedgerTransaction.id,
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
						amountInCents: taxedChargesInCents,
						accountTransactionTypeCode: ACCOUNT_TRANSACTION_TYPE.STUDENT_CHARGE,
						LedgerTransaction: {
							create: {
								amountInCents: taxedChargesInCents,
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
	return invoices;
}
