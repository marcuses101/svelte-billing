import { prisma } from './db';
import { ACCOUNT_TRANSACTION_TYPE, ACCOUNT_TYPE_CODE, LEDGER_CODE } from '$lib/defs';
import { wrapErr, wrapOk, type Result } from '$lib/rustResult';
import type { AccountTransaction } from '@prisma/client';

export async function recordCoachPaymentTransaction(
	coachId: string,
	amountInCents: number
): Promise<Result<AccountTransaction, { status: 404 | 500; message: string; error?: unknown }>> {
	const account = await prisma.account.findFirst({
		where: { accountTypeCode: ACCOUNT_TYPE_CODE.COACH, Coach: { id: coachId } }
	});
	if (!account) {
		return wrapErr({
			status: 404,
			message: `No account found associated to skater id "${coachId}"`
		});
	}
	try {
		const transaction = await prisma.accountTransaction.create({
			data: {
				amountInCents,
				accountId: account.id,
				accountTransactionTypeCode: ACCOUNT_TRANSACTION_TYPE.COACH_PAYMENT,
				LedgerTransaction: {
					create: {
						amountInCents,
						debitLedgerCode: LEDGER_CODE.ACCOUNTS_PAYABLE,
						creditLedgerCode: LEDGER_CODE.CASH
					}
				}
			}
		});
		return wrapOk(transaction);
	} catch (error) {
		return wrapErr({ status: 500, error, message: 'Error creating message' });
	}
}
