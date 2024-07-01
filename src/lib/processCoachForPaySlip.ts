import { calculateLessonCost } from '$lib/calculateLessonCost';
import { HST_PERCENTAGE } from '$lib/shared';
import type { getCoachesWithInfoForPayslip } from './getCoachesWithInfoForPayslip';
import { prettyLog } from './server/prettyLog';

export function processCoachForPaySlip(
	coach: Awaited<ReturnType<typeof getCoachesWithInfoForPayslip>>[number]
) {
	// calculate the total lessons
	const { chargesTotalInCents, coachPaySlipLineItems } = coach.Lessons.reduce(
		(acc, { date, id: lessonId, lessonTimeInMinutes, SkaterLessons }) => {
			const skaters = SkaterLessons.map((entry) => {
				return {
					skaterId: entry.skaterId,
					skaterTypeCode: entry.Skater.skaterTypeCode
				};
			});
			const { lessonCostInCents } = calculateLessonCost(
				lessonTimeInMinutes,
				coach.CoachRate,
				skaters
			);
			acc.chargesTotalInCents += lessonCostInCents;
			acc.coachPaySlipLineItems.push({
				date,
				lessonId,
				amountInCents: lessonCostInCents,
				description: `${lessonTimeInMinutes} minute lesson. ${SkaterLessons.length} skater(s)`
			});
			return acc;
		},
		{
			chargesTotalInCents: 0,
			coachPaySlipLineItems: [] as {
				date: Date;
				lessonId: string;
				amountInCents: number;
				description: string;
			}[]
		}
	);

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
		prettyLog({
			lessonSum: chargesTotalInCents,
			coachIncome: coachRevenueInCents,
			commissionRevenue: commissionAmountInCents
		});
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
