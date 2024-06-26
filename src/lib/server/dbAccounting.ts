import { prisma } from './db';
import { ACCOUNT_TRANSACTION_TYPE, LEDGER_CODE } from '$lib/defs';

export async function logStudentPayment(
	studentAccountId: string,
	amountInCents: number,
	date: Date
) {
	const [accountTransaction, ledgerTransaction] = await prisma.$transaction([
		prisma.accountTransaction.create({
			data: {
				amountInCents,
				date,
				accountId: studentAccountId,
				accountTransactionTypeCode: ACCOUNT_TRANSACTION_TYPE.STUDENT_PAYMENT
			}
		}),
		prisma.ledgerTransaction.create({
			data: {
				amountInCents,
				date,
				debitLedgerCode: LEDGER_CODE.CASH,
				creditLedgerCode: LEDGER_CODE.ACCOUNTS_RECEIVABLE
			}
		})
	]);

	console.log({ accountTransaction, ledgerTransaction });
}

export async function logCoachPayment(coachAccountId: string, amountInCents: number, date: Date) {
	const [accountTransaction, ledgerTransaction] = await prisma.$transaction([
		prisma.accountTransaction.create({
			data: {
				amountInCents,
				date,
				accountId: coachAccountId,
				accountTransactionTypeCode: ACCOUNT_TRANSACTION_TYPE.COACH_PAYMENT
			}
		}),
		prisma.ledgerTransaction.create({
			data: {
				amountInCents,
				date,
				debitLedgerCode: LEDGER_CODE.ACCOUNTS_PAYABLE,
				creditLedgerCode: LEDGER_CODE.CASH
			}
		})
	]);
	console.log({ accountTransaction, ledgerTransaction });
}
