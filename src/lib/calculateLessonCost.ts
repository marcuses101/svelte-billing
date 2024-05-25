import type { CoachRate } from '@prisma/client';

const GROUP_LESSON_THRESHOLD = 2;
const GROUP_LESSON_CUTOFF = 6;
const SURPLUS_IN_CENTS_PER_HOUR_PER_SKATER = 2_00;

// 2 dollars per additional skater up to a max of 6 skaters
function determineHourlySurplusInCents(numberOfSkaters: number): number {
	if (numberOfSkaters < GROUP_LESSON_THRESHOLD) {
		return 0;
	}
	const maximumFactor = GROUP_LESSON_CUTOFF - (GROUP_LESSON_THRESHOLD - 1);
	const factor = Math.min(numberOfSkaters - (GROUP_LESSON_THRESHOLD - 1), maximumFactor);
	return factor * SURPLUS_IN_CENTS_PER_HOUR_PER_SKATER;
}

export function calculateLessonCost(
	minutes: number,
	coachRates: Pick<CoachRate, 'skaterTypeCode' | 'hourlyRateInCents'>[],
	skaters: { skaterId: string; skaterTypeCode: string }[]
) {
	const rateMap = coachRates.reduce((acc, { skaterTypeCode, hourlyRateInCents }) => {
		acc.set(skaterTypeCode, hourlyRateInCents);
		return acc;
	}, new Map<string, number>());
	const numberOfSkaters = skaters.length;
	const hourlySurplusInCents = determineHourlySurplusInCents(numberOfSkaters);
	let lessonCostInCents = 0;
	const skatersWithCost = skaters.map(({ skaterTypeCode, skaterId }) => {
		const baseRate = rateMap.get(skaterTypeCode);
		if (!baseRate) {
			throw new Error(`rate not configured for skaterTypeCode "${skaterTypeCode}"`);
		}
		const hourlyRateInCents = baseRate + hourlySurplusInCents;
		const amountInCents = Math.round(((minutes / 60) * hourlyRateInCents) / numberOfSkaters);
		lessonCostInCents += amountInCents;
		return { skaterTypeCode, skaterId, amountInCents };
	});

	return { hourlySurplusInCents, lessonCostInCents, skatersWithCost };
}
