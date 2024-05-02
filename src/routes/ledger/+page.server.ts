import { prisma } from '$lib/server/db';
import { type LedgerCode, type LedgerType } from '$lib/server/defs';
import type { $Enums } from '@prisma/client';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const ledgers = await prisma.ledger.findMany({
		include: {
			LedgerType: true,
			CreditTransactions: { select: { amountInCents: true } },
			DebitTransactions: { select: { amountInCents: true } }
		}
	});

	function sum(transactions: { amountInCents: number }[]) {
		return transactions.reduce((acc, { amountInCents }) => (acc += amountInCents), 0);
	}

	const ledgerSummary = ledgers.reduce(
		(acc, { LedgerType, code, DebitTransactions, CreditTransactions }) => {
			const debitSumInCents = sum(DebitTransactions);
			const creditSumInCents = sum(CreditTransactions);
			const balanceInCents =
				LedgerType.positiveTransactionType === 'Debit'
					? debitSumInCents - creditSumInCents
					: creditSumInCents - debitSumInCents;

			acc[code as LedgerCode] = {
				positiveTransactionType: LedgerType.positiveTransactionType,
				ledgerType: LedgerType.code as LedgerType,
				debitSumInCents,
				creditSumInCents,
				balanceInCents
			};
			return acc;
		},
		{} as Record<
			LedgerCode,
			{
				positiveTransactionType: $Enums.TransactionType;
				ledgerType: LedgerType;
				balanceInCents: number;
				debitSumInCents: number;
				creditSumInCents: number;
			}
		>
	);

	return { ledgerSummary };
};
