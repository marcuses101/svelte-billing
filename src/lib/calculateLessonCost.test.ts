import { calculateLessonCost } from './calculateLessonCost';
import { test, expect } from 'vitest';
import { SKATER_TYPE } from './defs';

const RESIDENT_SKATERS = [...new Array(10)].map((_, index) => ({
	skaterId: `skater_${SKATER_TYPE.RESIDENT}_${index}`,
	skaterTypeCode: SKATER_TYPE.RESIDENT
}));

const US_SKATERS = [...new Array(10)].map((_, index) => ({
	skaterId: `skater_${SKATER_TYPE.US}_${index}`,
	skaterTypeCode: SKATER_TYPE.US
}));

const INTERNATIONAL_SKATERS = [...new Array(10)].map((_, index) => ({
	skaterId: `skater_${SKATER_TYPE.INTERNATIONAL}_${index}`,
	skaterTypeCode: SKATER_TYPE.INTERNATIONAL
}));

const COACH_RATES = [
	{ hourlyRateInCents: 60_00, skaterTypeCode: SKATER_TYPE.RESIDENT },
	{ hourlyRateInCents: 70_00, skaterTypeCode: SKATER_TYPE.US },
	{ hourlyRateInCents: 80_00, skaterTypeCode: SKATER_TYPE.INTERNATIONAL }
];

test("should throw error if skaterType isn't found in coach rates", () => {
	expect(() =>
		calculateLessonCost(60, COACH_RATES, [{ skaterTypeCode: 'FAKE', skaterId: 'fake_skater' }])
	).toThrowError('rate not configured for skaterTypeCode "FAKE"');
});

test('should return the expected amount for a single resident skater', () => {
	const skaters = RESIDENT_SKATERS.slice(0, 1);
	const result = calculateLessonCost(60, COACH_RATES, skaters);
	expect(result.lessonCostInCents).toBe(60_00);
	expect(result.skatersWithCost).toEqual([{ ...RESIDENT_SKATERS[0], amountInCents: 60_00 }]);
});

test('should return the expected amount for a single US skater', () => {
	const skaters = US_SKATERS.slice(0, 1);
	const result = calculateLessonCost(60, COACH_RATES, skaters);
	expect(result.lessonCostInCents).toBe(70_00);
	expect(result.skatersWithCost).toEqual([{ ...US_SKATERS[0], amountInCents: 70_00 }]);
});

test('should return the expected amount for a group of resident skaters', () => {
	const skaters = RESIDENT_SKATERS.slice(0, 3);
	const result = calculateLessonCost(60, COACH_RATES, skaters);
	// off by one cent due to rounding error
	expect(result.lessonCostInCents).toBeGreaterThanOrEqual(63_99);
	expect(result.lessonCostInCents).toBeLessThanOrEqual(64_01);
	expect(result.skatersWithCost).toHaveLength(3);
	expect(result.skatersWithCost).toEqual(
		skaters.map((skater) => ({ ...skater, amountInCents: Math.round(64_00 / 3) }))
	);
});

test('should return the expected amount for a group of more than 6 resident skaters', () => {
	const skaters = RESIDENT_SKATERS;
	const result = calculateLessonCost(60, COACH_RATES, skaters);
	expect(result.lessonCostInCents).toBe(70_00);
	expect(result.skatersWithCost).toHaveLength(10);
	expect(result.skatersWithCost).toEqual(
		skaters.map((skater) => ({ ...skater, amountInCents: 70_00 / 10 }))
	);
});
test('should return the expected amount for a group of mixed skaters', () => {
	const skaters = [RESIDENT_SKATERS[0], US_SKATERS[0], INTERNATIONAL_SKATERS[0]] as Parameters<
		typeof calculateLessonCost
	>[2];
	const result = calculateLessonCost(60, COACH_RATES, skaters);
	expect(result.lessonCostInCents).toBe(74_00); // 64/3 + 74/3 + 84/3
	expect(result.skatersWithCost).toHaveLength(3);
	expect(result.skatersWithCost).toEqual([
		{ ...RESIDENT_SKATERS[0], amountInCents: 2133 },
		{ ...US_SKATERS[0], amountInCents: 2467 },
		{ ...INTERNATIONAL_SKATERS[0], amountInCents: 2800 }
	]);
});
