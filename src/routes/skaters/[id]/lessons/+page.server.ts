import { prisma } from '$lib/server/db';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const skaterInfo = await prisma.skater.findUnique({
		where: { id: params.id },
		include: {
			lessons: {
				select: {
					Lesson: {
						include: {
							_count: { select: { SkaterLessons: true } },
							Coach: {
								select: { user: { select: { firstName: true, lastName: true, email: true } } }
							}
						}
					}
				}
			}
		}
	});
	if (!skaterInfo) {
		error(404);
	}
	const { lessons: rawLessons, ...skater } = skaterInfo;
	const lessons = rawLessons.map(({ Lesson: lesson }) => {
		const numberOfSkaters = lesson._count.SkaterLessons;
		const chargeInCents = Math.ceil(lesson.lessonCostInCents / numberOfSkaters);
		const { firstName, lastName, email } = lesson.Coach.user;
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
