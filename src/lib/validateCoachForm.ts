import { fail, type ActionFailure } from '@sveltejs/kit';
import { SKATER_TYPE } from '$lib/defs';
import type { SkaterType } from '$lib/defs';
import { wrapErr, type Result, wrapOk } from '$lib/rustResult';

export type CoachFormData = {
	firstName: string;
	lastName: string;
	email: string;
	commissionPercentage: number;
	coachRates: { skaterTypeCode: SkaterType; hourlyRateInCents: number }[];
	isHstCharged: boolean;
};

export type CoachFormFailure = ActionFailure<{ missingFields: string[] }>;

export function validateCoachForm(data: FormData): Result<CoachFormData, CoachFormFailure> {
	const isHstChargedString = data.get('is-hst-charged');
	if (typeof isHstChargedString !== 'string') {
		return wrapErr(fail(400, { missingFields: ['is-hst-charged'] }));
	}
	const isHstCharged = isHstChargedString === 'true';
	const firstName = data.get('first-name');
	if (!firstName || typeof firstName !== 'string') {
		return wrapErr(fail(400, { missingFields: ['first-name'] }));
	}
	const lastName = data.get('last-name');
	if (!lastName || typeof lastName !== 'string') {
		return wrapErr(fail(400, { missingFields: ['last-name'] }));
	}
	const email = data.get('email');
	if (!email || typeof email !== 'string') {
		return wrapErr(fail(400, { missingFields: ['email'] }));
	}

	const commissionPercentageString = data.get('commission-percentage');
	if (!commissionPercentageString || typeof commissionPercentageString !== 'string') {
		return wrapErr(fail(400, { missingFields: ['commission-percentage'] }));
	}
	const commissionPercentage = parseFloat(commissionPercentageString);

	const coachRates: { skaterTypeCode: SkaterType; hourlyRateInCents: number }[] = [];
	let missingRates: `hourly-rate-${SkaterType}`[] = [];

	for (let skaterTypeCode of Object.values(SKATER_TYPE)) {
		let id = `hourly-rate-${skaterTypeCode}` as const;
		let rate = data.get(id);
		if (!rate || typeof rate !== 'string') {
			missingRates.push(id);
			continue;
		}
		let rateInCents = parseInt(rate, 10);
		coachRates.push({ skaterTypeCode, hourlyRateInCents: rateInCents });
	}

	if (missingRates.length > 0) {
		return wrapErr(fail(400, { missingFields: missingRates }));
	}
	return wrapOk({
		firstName,
		lastName,
		email,
		commissionPercentage,
		coachRates,
		isHstCharged
	});
}
