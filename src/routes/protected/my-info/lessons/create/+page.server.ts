import { fail, error } from '@sveltejs/kit';
import { getSkaters, prisma } from '$lib/server/db';
import type { Actions } from './$types';
import { wrapErr, type Result, wrapOk } from '$lib/rustResult';

export async function load() {
	const skaters = await getSkaters();
	return { skaters };
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
	if (minutes === 0) {
		validationObject.minutes = 'minutes cannot be 0';
	}

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
		const logger = locals.logger.child({
			formData: Object.fromEntries(data.entries()),
			action: 'lesson-create'
		});
		const session = await locals.auth();
		const coachUser = session?.user;
		if (!coachUser || !coachUser.Coach) {
			const errorMessage = 'unable to find coach';
			logger.error(errorMessage);
			return error(404, errorMessage);
		}
		const formValidationResult = validateForm(data);
		if (!formValidationResult.ok) {
			logger.warn({ validationError: formValidationResult.error }, 'form validation error');
			return fail(400, { success: false, errors: formValidationResult.error });
		}
		const { lessonTimeInMinutes, date: rawDate, skaterIds } = formValidationResult.value;

		const date = new Date(rawDate).toISOString();
		try {
			const createdLesson = await prisma.lesson.create({
				data: {
					date,
					lessonTimeInMinutes,
					SkaterLessons: { create: skaterIds.map((id) => ({ Skater: { connect: { id } } })) },
					Coach: { connect: { id: coachUser.Coach.id } }
				},
				include: { SkaterLessons: { include: { Skater: true } } }
			});
			logger.info('lesson created');
			return { success: true, lessonTimeInMinutes: createdLesson.lessonTimeInMinutes };
		} catch (e) {
			logger.error(e as Error);
			return error(500, 'Database Error');
		}
	}
} satisfies Actions;
