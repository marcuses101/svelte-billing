import { calculateLesson } from '$lib/calculateLessonCost';
import { calculateLessonQuery, prisma } from '$lib/server/db';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const skaterInfo = await prisma.skater.findUnique({
		where: { id: params.id },
		include: {
			SkaterLessons: {
				select: {
					Lesson: calculateLessonQuery
				}
			}
		}
	});
	if (!skaterInfo) {
		error(404);
	}
	const { SkaterLessons: rawLessons, ...skater } = skaterInfo;
	const lessons = rawLessons.map(({ Lesson: lesson }) => {
		const numberOfSkaters = lesson._count.SkaterLessons;
		const { lessonCostInCents, skatersWithCost } = calculateLesson(lesson);
		const maybeCharge = skatersWithCost.find((entry) => entry.skaterId === skaterInfo.id);
		if (!maybeCharge) {
			throw new Error('skater not found');
		}
		const { amountInCents: chargeInCents } = maybeCharge;
		const { firstName, lastName, email } = lesson.Coach.User;
		const coachName = firstName && lastName ? `${firstName} ${lastName}` : email;
		return {
			id: lesson.id,
			date: lesson.date,
			chargeInCents,
			numberOfSkaters,
			coachName,
			lessonTimeInMinutes: lesson.lessonTimeInMinutes,
			cost: lessonCostInCents
		};
	});

	return { skater, lessons };
};
