export function calculateLessonCost(
	minutes: number,
	hourlyRate: number,
	numberOfSkaters: number
): { lessonCostInCents: number; lessonCostPerSkaterInCents: number } {
	const centsPerMinute = hourlyRate / 60;
	const lessonCostInCents = centsPerMinute * minutes;
	const lessonCostPerSkaterInCents = lessonCostInCents / numberOfSkaters;
	return { lessonCostInCents, lessonCostPerSkaterInCents };
}
