import { getSkaters, prisma } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { ACCOUNT_TRANSACTION_TYPE, ACCOUNT_TYPE_CODE, LEDGER_CODE } from '$lib/defs';
import { validateRole } from '$lib/validateRole';

export const load: PageServerLoad = async ({ locals }) => {
	const skaters = await getSkaters();

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
	console.log({ paymentEntries, roles: locals.user?.UserRoles });

	return { skaters, paymentEntries };
};

async function getAccountBySkaterId(skaterId: string) {
	return prisma.account.findFirst({
		where: { accountTypeCode: ACCOUNT_TYPE_CODE.STUDENT, Skater: { id: skaterId } }
	});
}

export const actions = {
	default: async ({ request, locals }) => {
		const isAdmin = validateRole(locals, 'ADMIN');
		if (!isAdmin) {
			return fail(403, { message: 'You are not authorized to perform this action' });
		}
		const formData = await request.formData();
		const skaterId = formData.get('skater-id');
		const amount = formData.get('amount');

		if (!skaterId || typeof skaterId !== 'string' || !amount || typeof amount !== 'string') {
			return fail(400, {
				message: 'Both Skater and Amount are required'
			});
		}

		const amountInCents = Math.round(parseFloat(amount) * 100);
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

// TODO - validate that the user has permission to log a payment

// TODO - Provide the current balance of each skater
