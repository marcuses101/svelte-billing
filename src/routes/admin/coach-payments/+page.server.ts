import { prisma } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { ACCOUNT_TRANSACTION_TYPE, ACCOUNT_TYPE_CODE, LEDGER_CODE } from '$lib/defs';
import type { $Enums, AccountTransaction } from '@prisma/client';
import { validateUserIsAdmin } from '$lib/validateUserIsAdmin';
import { wrapErr, wrapOk, type Result } from '$lib/rustResult';
import { recordCoachPaymentTransaction } from '$lib/server/dbAccounting';

export const load: PageServerLoad = async () => {
	const coachInfo = await prisma.coach.findMany({
		orderBy: { User: { firstName: 'asc' } },
		include: {
			User: { select: { firstName: true, lastName: true } },
			Account: {
				include: {
					AccountTransaction: {
						select: { amountInCents: true, AccountTransactionType: { select: { type: true } } }
					}
				}
			}
		}
	});

	const coachBalances = coachInfo.map(
		({ id: coachId, User: { firstName, lastName }, Account: { AccountTransaction } }) => {
			const fullName = `${firstName} ${lastName}`;
			const balance = AccountTransaction.reduce((acc, transaction) => {
				const type: $Enums.TransactionType = transaction.AccountTransactionType.type;
				if (type === 'Credit') {
					return acc - transaction.amountInCents;
				}
				return acc + transaction.amountInCents;
			}, 0);
			return { coachId, fullName, balance };
		}
	);

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

	return { coachBalances, paymentEntries };
};

export const actions = {
	default: async ({ request, locals }) => {
		const isAdmin = validateUserIsAdmin(locals);
		if (!isAdmin) {
			return fail(403, { message: 'You are not authorized to perform this action' });
		}
		const formData = await request.formData();
		const coachId = formData.get('coach-id');
		const amountInCentsString = formData.get('amount-in-cents');

		if (
			!coachId ||
			typeof coachId !== 'string' ||
			!amountInCentsString ||
			typeof amountInCentsString !== 'string'
		) {
			return fail(400, {
				message: 'Both Coach and Amount are required'
			});
		}

		const amountInCents = parseInt(amountInCentsString, 10);
		const transactionResult = await recordCoachPaymentTransaction(coachId, amountInCents);
		if (!transactionResult.ok) {
			return fail(transactionResult.error.status, {
				message: transactionResult.error.message
			});
		}
		return { success: true };
	}
} satisfies Actions;
