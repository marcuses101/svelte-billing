import { prisma } from '$lib/server/db';
import type { $Enums } from '@prisma/client';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const skaterInfo = await prisma.skater.findMany({
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
	const coachInfo = await prisma.coach.findMany({
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

	const skaterBalances = skaterInfo.map(
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

	return { skaterBalances, coachBalances };
};
