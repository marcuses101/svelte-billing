import { prisma } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getLineItemDescription } from '$lib/server/generateBillingBatch';
import type { InvoiceLineItem } from '@prisma/client';

export const load: PageServerLoad = async ({ params }) => {
	const skaterInfo = await prisma.skater.findUnique({
		where: { id: params.id },
		include: {
			SkaterLessons: {
				select: {
					Lesson: {
						include: {
							_count: { select: { SkaterLessons: true } },
							Coach: {
								select: { User: { select: { firstName: true, lastName: true, email: true } } }
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
	const { SkaterLessons: rawLessons, ...skater } = skaterInfo;
	const lineItems: InvoiceLineItem[] = rawLessons.map(({ Lesson: lesson }) => {
		const numberOfSkaters = lesson._count.SkaterLessons;
		const lessonCostPerSkaterInCents = lesson.lessonCostPerSkaterInCents;
		const lessonTimeInMinutes = lesson.lessonTimeInMinutes;

		const { firstName, lastName } = lesson.Coach.User;
		const coachName = `${firstName} ${lastName}`;
		const description = getLineItemDescription(numberOfSkaters, lessonTimeInMinutes, coachName);
		return {
			id: lesson.id,
			date: lesson.date,
			amountInCents: lessonCostPerSkaterInCents,
			description,
			invoiceId: 'TBD',
			skaterLessonLessonId: lesson.id,
			skaterLessonSkaterId: skater.id
		};
	});

	return { skater, lineItems };
};
