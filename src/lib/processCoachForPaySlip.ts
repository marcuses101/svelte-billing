import { calculateLessonCost } from '$lib/calculateLessonCost';
import { HST_PERCENTAGE } from '$lib/shared';
import type { Prisma, TransactionType } from '@prisma/client';
import type { getCoachesWithInfoForPayslip } from './getCoachesWithInfoForPayslip';
import type { Logger } from 'pino';

export function processCoachForPaySlip(
	coach: Awaited<ReturnType<typeof getCoachesWithInfoForPayslip>>[number],
	logger: Logger
) {
	const coachPaySlipLineItems: Omit<
		Prisma.CoachPaySlipLineItemUncheckedCreateInput,
		'coachPaySlipId'
	>[] = [];
	// calculate the total lessons
	//
	coach.Lessons.forEach((lesson) => {
		const skaters = lesson.SkaterLessons.map((entry) => {
			return {
				skaterId: entry.skaterId,
				skaterTypeCode: entry.Skater.skaterTypeCode
			};
		});
		const { lessonCostInCents } = calculateLessonCost(
			lesson.lessonTimeInMinutes,
			coach.CoachRate,
			skaters
		);
		coachPaySlipLineItems.push({
			date: lesson.date,
			description: `${lesson.lessonTimeInMinutes} minute lesson. ${lesson.SkaterLessons.length} skater(s)`,
			amountInCents: lessonCostInCents,
			transactionType: 'Debit',
			lessonId: lesson.id
		});
	});

	coach.CoachPaySlipMiscellaneousItem.forEach((item) => {
		const skater = item.skaterInvoiceMiscellaneousItem?.Skater;
		const skaterName = skater ? `${skater.firstName} ${skater.lastName}` : 'Unknown';
		const description = `${item.description} (${skaterName})`;
		coachPaySlipLineItems.push({
			date: item.date,
			amountInCents: item.amountInCents,
			transactionType: item.transactionType,
			description,
			coachPaySlipMiscellaneousItemId: item.id
		});
	});

	const chargesTotalInCents = coachPaySlipLineItems.reduce(
		(acc, { amountInCents, transactionType }) => {
			return transactionType === 'Debit' ? acc + amountInCents : acc - amountInCents;
		},
		0
	);

	coachPaySlipLineItems.sort((a, b) => new Date(a.date).getDate() - new Date(b.date).getDate());

	// commission is based on the total charges from this billing period;
	const commissionPercentage = coach.commissionPercentage;
	const commissionAmountInCents = Math.floor((commissionPercentage / 100) * chargesTotalInCents);

	const coachRevenueInCents = chargesTotalInCents - commissionAmountInCents;

	// calculate HST
	const hstAmountInCents = coach.isHstCharged
		? Math.round((HST_PERCENTAGE / 100) * coachRevenueInCents)
		: 0;

	const previousPaySlip = coach.CoachPaySlips[0];
	const previousPaySlipAmountInCents = previousPaySlip?.amountDueInCents ?? 0;

	const paymentsTotal = coach.Account.AccountTransaction.reduce(
		(acc, { amountInCents }) => acc + amountInCents,
		0
	);

	if (coachRevenueInCents + commissionAmountInCents !== chargesTotalInCents) {
		logger.error(
			{
				lessonSum: chargesTotalInCents,
				coachIncome: coachRevenueInCents,
				commissionRevenue: commissionAmountInCents
			},
			"coach calculation error. coachRenevueInCents and commission doesn't equate to chargesTotalInCents"
		);
		throw new Error('Commision Calculation Error');
	}

	const outstandingBalanceInCents = previousPaySlipAmountInCents - paymentsTotal;
	const amountDueInCents = coachRevenueInCents + outstandingBalanceInCents + hstAmountInCents;

	const returnValue = {
		hstAmountInCents,
		commissionAmountInCents,
		outstandingBalanceInCents,
		amountDueInCents,
		previousCoachPaySlipId: previousPaySlip?.id,
		coachRevenueInCents,
		chargesTotalInCents,
		previousPaySlipAmountInCents,
		coachPaySlipLineItems,
		paymentAccountTransactions: coach.Account.AccountTransaction
	};

	return returnValue;
}
