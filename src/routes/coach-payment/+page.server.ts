import { prisma } from '$lib/server/db';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { ACCOUNT_TRANSACTION_TYPE, ACCOUNT_TYPE_CODE, LEDGER_CODE } from '$lib/defs';
import { validateRole } from '$lib/validateRole';

export const load: PageServerLoad = async () => {
	const coaches = await prisma.coach.findMany({
		select: { id: true, User: { select: { firstName: true, lastName: true } } }
	});

	const payments = await prisma.accountTransaction.findMany({
		where: {
			accountTransactionTypeCode: ACCOUNT_TRANSACTION_TYPE.COACH_PAYMENT
		},
		include: {
			Account: {
				include: {
					Coach: {
						select: {
							User: {
								select: {
									firstName: true,
									lastName: true
								}
							}
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
		const user = payment.Account.Coach?.User;
		const name = user ? `${user.firstName} ${user.lastName}` : 'unknown user';
		return { date, amountInCents, name };
	});

	return { coaches, paymentEntries };
};

export const actions = {
	default: async ({ request, locals }) => {
		const session = await locals.auth();
		const user = session?.user;
		if (!user) {
			return redirect(303, '/login');
		}
		const isAdmin = validateRole(user, 'ADMIN');

		if (!isAdmin) {
			return fail(403, { message: 'You are not authorized to perform this action' });
		}
		const formData = await request.formData();
		const coachId = formData.get('coach-id');
		const amount = formData.get('amount');

		if (!coachId || typeof coachId !== 'string' || !amount || typeof amount !== 'string') {
			return fail(400, {
				message: 'Both Coach and Amount are required'
			});
		}

		const amountInCents = Math.round(parseFloat(amount) * 100);
		// get skater's account number
		const account = await prisma.account.findFirst({
			where: { accountTypeCode: ACCOUNT_TYPE_CODE.COACH, Coach: { id: coachId } }
		});
		if (!account) {
			return fail(404, {
				message: `No account found associated to skater id "${coachId}"`
			});
		}
		try {
			await prisma.accountTransaction.create({
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
		} catch (error) {
			return fail(500, { message: 'Error creating transaction' });
		}
		return { success: true };
	}
} satisfies Actions;

// TODO - validate that the user has permission to log a payment

// TODO - Provide the current balance of each skater
