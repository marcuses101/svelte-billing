import { ACCOUNT_TRANSACTION_TYPE, LEDGER_CODE } from '../defs';
import type { Prisma } from '@prisma/client';
import { getCoachesWithInfoForPayslip } from '../getCoachesWithInfoForPayslip';
import { processCoachForPaySlip } from '../processCoachForPaySlip';

export async function generateCoachPaySlips(tx: Prisma.TransactionClient, billingBatchId: string) {
	const coaches = await getCoachesWithInfoForPayslip(tx);

	for (const coach of coaches) {
		if (coach.Lessons.length === 0) {
			continue;
		}
		const {
			amountDueInCents,
			hstAmountInCents,
			commissionAmountInCents,
			previousCoachPaySlipId,
			coachRevenueInCents,
			chargesTotalInCents,
			outstandingBalanceInCents,
			previousPaySlipAmountInCents,
			coachPaySlipLineItems
		} = processCoachForPaySlip(coach);

		const ledgerTransactions: Prisma.LedgerTransactionCreateManyInput[] = [
			{
				amountInCents: coachRevenueInCents,
				debitLedgerCode: LEDGER_CODE.INVOICING,
				creditLedgerCode: LEDGER_CODE.ACCOUNTS_PAYABLE
			}
		];
		if (commissionAmountInCents > 0) {
			ledgerTransactions.push({
				amountInCents: commissionAmountInCents,
				debitLedgerCode: LEDGER_CODE.INVOICING,
				creditLedgerCode: LEDGER_CODE.COMMISSION
			});
		}
		if (hstAmountInCents > 0) {
			ledgerTransactions.push({
				amountInCents: hstAmountInCents,
				debitLedgerCode: LEDGER_CODE.INVOICING_HST,
				creditLedgerCode: LEDGER_CODE.COACH_HST
			});
			ledgerTransactions.push({
				amountInCents: hstAmountInCents,
				debitLedgerCode: LEDGER_CODE.COACH_HST,
				creditLedgerCode: LEDGER_CODE.ACCOUNTS_PAYABLE
			});
		}

		await tx.coachPaySlip.create({
			data: {
				billingBatchId: billingBatchId,
				previousCoachPaySlipId,
				coachId: coach.id,
				amountDueInCents,
				hstAmountInCents,
				coachRevenueInCents,
				chargesTotalInCents,
				commissionPercentage: coach.commissionPercentage,
				commissionAmountInCents,
				outstandingBalanceInCents,
				previousPaySlipAmountInCents,
				CoachPaymentAccountTransactions: {
					connect: coach.Account.AccountTransaction.map(({ id }) => ({ id }))
				},

				CoachPaySlipLineItems: {
					createMany: {
						data: coachPaySlipLineItems
					}
				},
				PaySlipChargeAccountTransaction: {
					create: {
						amountInCents: coachRevenueInCents + hstAmountInCents,
						accountId: coach.accountId,
						accountTransactionTypeCode: ACCOUNT_TRANSACTION_TYPE.COACH_CHARGE,
						LedgerTransaction: {
							createMany: {
								data: ledgerTransactions
							}
						}
					}
				}
			}
		});
	}
}
