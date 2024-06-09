import { getSkaters, prisma } from '$lib/server/db';
import type { Actions, PageServerLoad } from './$types';
import { wrapErr, type Result, wrapOk } from '$lib/rustResult';
import { error, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const lessonId = params.id;
	const lesson = await prisma.lesson.findUnique({
		where: { id: lessonId },
		include: { SkaterLessons: { select: { Skater: true } } }
	});
	if (!lesson) {
		error(404, `Lesson with the id ${lessonId} not found`);
	}
	const skaters = await getSkaters();
	return { skaters, lesson };
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

		const createdLesson = await prisma.lesson.update({
			where: { id: params.id },
			data: {
				date,
				lessonTimeInMinutes,
				modifiedOn: new Date(),
				SkaterLessons: {
					deleteMany: {},
					create: skaterIds.map((id) => ({ Skater: { connect: { id } } }))
				},
				Coach: { connect: { id: coachUser.Coach.id } }
			},
			include: { SkaterLessons: { include: { Skater: true } } }
		});
		return { success: true, lessonTimeInMinutes: createdLesson.lessonTimeInMinutes };
	}
} satisfies Actions;
