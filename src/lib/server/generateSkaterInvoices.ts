import { ACCOUNT_TRANSACTION_TYPE, LEDGER_CODE } from '../defs';
import type { Prisma } from '@prisma/client';
import { processSkaterInfoForInvoice } from '../processSkaterInfoForInvoice';
import { getSkatersWithUninvoicedLessons } from '../getSkatersWithUninvoicedLessons';

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
			outstandingBalanceInCents,
			skaterId
		} = processSkaterInfoForInvoice(skater);

		const newInvoice = await tx.skaterInvoice.create({
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
						amountInCents: chargesTotalInCents + hstAmountInCents,
						accountTransactionTypeCode: ACCOUNT_TRANSACTION_TYPE.STUDENT_CHARGE,
						LedgerTransaction: {
							createMany: {
								data: [
									{
										amountInCents: chargesTotalInCents,
										debitLedgerCode: LEDGER_CODE.ACCOUNTS_RECEIVABLE,
										creditLedgerCode: LEDGER_CODE.INVOICING
									},
									{
										amountInCents: hstAmountInCents,
										debitLedgerCode: LEDGER_CODE.ACCOUNTS_RECEIVABLE,
										creditLedgerCode: LEDGER_CODE.INVOICING_HST
									}
								]
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
