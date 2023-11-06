import { prisma } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const skaterInfo = await prisma.skater.findUnique({
		where: { id: params.id },
		include: {
			lessons: {
				select: {
					Lesson: {
						include: {
							_count: { select: { skaters: true } },
							coach: {
								select: { user: { select: { firstName: true, lastName: true, email: true } } }
							}
						}
					}
				}
			}
		}
	});
	if (!skaterInfo) {
		throw error(404);
	}
	const { lessons: rawLessons, ...skater } = skaterInfo;
	const lessons = rawLessons.map(({ Lesson: lesson }) => {
		const numberOfSkaters = lesson._count.skaters;
		const chargeInCents = Math.ceil(lesson.lessonCostInCents / numberOfSkaters);
		const { firstName, lastName, email } = lesson.coach.user;
		const coachName = firstName && lastName ? `${firstName} ${lastName}` : email;
		return {
			id: lesson.id,
			date: lesson.date,
			chargeInCents,
			numberOfSkaters,
			coachName,
			lessonTimeInMinutes: lesson.lessonTimeInMinutes,
			cost: lesson.lessonCostInCents
		};
	});

	return { skater, lessons };
};
