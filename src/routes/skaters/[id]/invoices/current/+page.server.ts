import { calculateLessonQuery, prisma } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getLineItemDescription } from '$lib/server/generateBillingBatch';
import type { InvoiceLineItem } from '@prisma/client';
import { calculateLesson } from '$lib/calculateLessonCost';

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
	const lineItems: InvoiceLineItem[] = rawLessons.map(({ Lesson: lesson }) => {
		const numberOfSkaters = lesson._count.SkaterLessons;
		const { skatersWithCost } = calculateLesson(lesson);
		const skaterCost = skatersWithCost.find((entry) => {
			entry.skaterId === skaterInfo.id;
		});
		if (!skaterCost) {
			throw new Error('skater cost not found');
		}
		const lessonTimeInMinutes = lesson.lessonTimeInMinutes;

		const { firstName, lastName } = lesson.Coach.User;
		const coachName = `${firstName} ${lastName}`;
		const description = getLineItemDescription(numberOfSkaters, lessonTimeInMinutes, coachName);
		return {
			id: lesson.id,
			date: lesson.date,
			amountInCents: skaterCost.amountInCents,
			description,
			invoiceId: 'TBD',
			skaterLessonLessonId: lesson.id,
			skaterLessonSkaterId: skater.id
		};
	});

	return { skater, lineItems };
};
