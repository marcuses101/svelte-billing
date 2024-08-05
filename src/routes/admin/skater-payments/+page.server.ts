import { prisma } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { ACCOUNT_TRANSACTION_TYPE, ACCOUNT_TYPE_CODE, LEDGER_CODE } from '$lib/defs';
import { validateUserIsAdmin } from '$lib/validateUserIsAdmin';
import type { $Enums } from '@prisma/client';

export const load: PageServerLoad = async () => {
	const skaters = await prisma.skater.findMany({
		orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
		include: {
			Account: {
				include: {
					AccountTransaction: {
						select: { amountInCents: true, AccountTransactionType: { select: { type: true } } }
					}
				}
			}
		}
	});
	const skaterBalances = skaters.map(
		({ id: skaterId, firstName, lastName, Account: { AccountTransaction } }) => {
			const fullName = `${firstName} ${lastName}`;
			const balance = AccountTransaction.reduce((acc, transaction) => {
				const type: $Enums.TransactionType = transaction.AccountTransactionType.type;
				if (type === 'Credit') {
					return acc + transaction.amountInCents;
				}
				return acc - transaction.amountInCents;
			}, 0);
			return { skaterId, fullName, balance };
		}
	);
	const payments = await prisma.accountTransaction.findMany({
		where: {
			accountTransactionTypeCode: ACCOUNT_TRANSACTION_TYPE.STUDENT_PAYMENT
		},
		include: {
			Account: {
				include: {
					Skater: {
						select: {
							id: true,
							firstName: true,
							lastName: true
						}
					}
				}
			}
		},
		orderBy: { date: 'desc' }
	});

	const paymentEntries = payments.map((payment) => {
		const date = payment.date;
		const amountInCents = payment.amountInCents;
		const skater = payment.Account.Skater;
		const name = skater ? `${skater.firstName} ${skater.lastName}` : 'unknown';
		return { date, amountInCents, name };
	});
	console.log({ skaterBalances, paymentEntries });

	return { skaterBalances, paymentEntries };
};

async function getAccountBySkaterId(skaterId: string) {
	return prisma.account.findFirst({
		where: { accountTypeCode: ACCOUNT_TYPE_CODE.STUDENT, Skater: { id: skaterId } }
	});
}

export const actions = {
	default: async ({ request, locals }) => {
		const isAdmin = validateUserIsAdmin(locals);
		if (!isAdmin) {
			return fail(403, { message: 'You are not authorized to perform this action' });
		}
		const formData = await request.formData();
		const skaterId = formData.get('skater-id');
		const amountInCentsString = formData.get('amount-in-cents');

		if (
			!skaterId ||
			typeof skaterId !== 'string' ||
			!amountInCentsString ||
			typeof amountInCentsString !== 'string'
		) {
			return fail(400, {
				message: 'Both Skater and Amount are required'
			});
		}
		const amountInCents = parseInt(amountInCentsString, 10);

		// get skater's account number
		const account = await getAccountBySkaterId(skaterId);
		if (!account) {
			return fail(404, {
				message: `No account found associated to skater id "${skaterId}"`
			});
		}
		try {
			await prisma.accountTransaction.create({
				data: {
					amountInCents,
					accountId: account.id,
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
		} catch (error) {
			return fail(500, { message: 'Error creating transaction' });
		}
		return { success: true };
	}
} satisfies Actions;
