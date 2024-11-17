import { ACCOUNT_TRANSACTION_TYPE, LEDGER_CODE } from '$lib/defs';
import { wrapOk, wrapErr } from '$lib/rustResult';
import { prisma } from '$lib/server/db';

export async function saveClientPayment(accountId: string, amountInCents: number) {
	try {
		const transaction = await prisma.accountTransaction.create({
			data: {
				amountInCents,
				accountId,
				accountTransactionTypeCode: ACCOUNT_TRANSACTION_TYPE.STUDENT_PAYMENT,
				LedgerTransaction: {
					create: {
						amountInCents,
						debitLedgerCode: LEDGER_CODE.CASH,
						creditLedgerCode: LEDGER_CODE.ACCOUNTS_RECEIVABLE
					}
				}
			}
		});
		return wrapOk(transaction);
	} catch (e) {
		return wrapErr(e);
	}
}
