import { fail, error } from '@sveltejs/kit';
import { getCurrentCoachUser, getSkaters, prisma } from '$lib/server/db';
import type { Actions } from './$types';
import { wrapErr, type Result, wrapOk } from '$lib/rustResult';

export function load() {
	return { skaters: getSkaters() };
}

function validateForm(
	data: FormData
): Result<
	{ date: string; lessonTimeInMinutes: number; skaterIds: string[] },
	Record<string, string>
> {
	const validationObject: Record<string, string> = {};
	const formMinutes = data.get('time-in-minutes');
	const skaterIds = data.getAll('skaters');
	const date = data.get('date');
	if (!formMinutes) {
		validationObject.minutes = 'minutes field is required';
	}
	if (!date || typeof date !== 'string') {
		validationObject.date = 'date field is required';
	}
	if (skaterIds.length === 0) {
		validationObject.skater = 'at least one skater must be specified';
	}
	const minutes = parseInt(formMinutes! as string);

	if (Object.keys(validationObject).length > 0) {
		return wrapErr(validationObject);
	}
	return wrapOk({
		lessonTimeInMinutes: minutes,
		date: date as string,
		skaterIds: skaterIds as string[]
	});
}

export const actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();
		const coachUser = locals.user;
		if (!coachUser || !coachUser.Coach) {
			const errorMessage = 'unable to find coach';
			throw error(404, errorMessage);
		}
		const formValidationResult = validateForm(data);
		if (!formValidationResult.ok) {
			return fail(400, formValidationResult.error);
		}
		const { lessonTimeInMinutes, date, skaterIds } = formValidationResult.value;
		const createdLesson = await prisma.lesson.create({
			data: {
				date: new Date(date).toISOString(),
				lessonTimeInMinutes,
				lessonCostInCents: (coachUser.Coach?.hourlyRateInCents / 60) * lessonTimeInMinutes,
				createdOn: new Date(),
				skaters: { create: skaterIds.map((id) => ({ Skater: { connect: { id } } })) },
				coach: { connect: { id: coachUser.Coach.id } }
			},
			include: { skaters: { include: { Skater: true } } }
		});
		return { success: true, lesson: createdLesson };
	}
} satisfies Actions;
