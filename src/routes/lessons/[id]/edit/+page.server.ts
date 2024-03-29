import { getSkaters, prisma } from '$lib/server/db';
import type { Actions, PageServerLoad } from './$types';
import { wrapErr, type Result, wrapOk } from '$lib/rustResult';
import { error, fail } from '@sveltejs/kit';
import { calculateLessonCost } from '$lib/calculateLessonCost';

export const load: PageServerLoad = async ({ params }) => {
	const lessonId = params.id;
	const lesson = await prisma.lesson.findUnique({
		where: { id: lessonId },
		include: { skaters: { select: { Skater: true } } }
	});
	if (!lesson) {
		error(404, `Lesson with the id ${lessonId} not found`);
	}
	return { skaters: getSkaters(), lesson };
};

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
	default: async ({ request, locals, params }) => {
		const data = await request.formData();
		const coachUser = locals.user;
		if (!coachUser || !coachUser.Coach) {
			const errorMessage = 'unable to find coach';
			error(404, errorMessage);
		}
		const formValidationResult = validateForm(data);
		if (!formValidationResult.ok) {
			return fail(400, { success: false, errors: formValidationResult.error });
		}

		const { lessonTimeInMinutes, date: rawData, skaterIds } = formValidationResult.value;
		const date = new Date(rawData).toISOString();
		const { lessonCostPerSkaterInCents, lessonCostInCents } = calculateLessonCost(
			lessonTimeInMinutes,
			coachUser.Coach.hourlyRateInCents,
			skaterIds.length
		);

		const createdLesson = await prisma.lesson.update({
			where: { id: params.id },
			data: {
				date,
				lessonTimeInMinutes,
				lessonCostInCents,
				lessonCostPerSkaterInCents,
				modifiedOn: new Date(),
				skaters: {
					deleteMany: {},
					create: skaterIds.map((id) => ({ Skater: { connect: { id } } }))
				},
				coach: { connect: { id: coachUser.Coach.id } }
			},
			include: { skaters: { include: { Skater: true } } }
		});
		return { success: true, lessonTimeInMinutes: createdLesson.lessonTimeInMinutes };
	}
} satisfies Actions;
