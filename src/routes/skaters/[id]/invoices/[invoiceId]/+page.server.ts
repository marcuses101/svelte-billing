import { prisma } from '$lib/server/db';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

type Lesson = {
	numberOfSkaters: number;
	lessonCostPerSkaterInCents: number;
	date: Date;
	lessonTimeInMinutes: number;
};

export const load: PageServerLoad = async ({ params }) => {
	const invoice = await prisma.invoice.findUnique({
		where: { id: params.invoiceId, skaterId: params.id },
		include: {
			skaterLessons: {
				orderBy: [{ Lesson: { date: 'asc' } }, { Lesson: { createdOn: 'asc' } }],
				include: {
					Lesson: {
						select: {
							date: true,
							lessonCostPerSkaterInCents: true,
							skaters: { select: { skaterId: true } },
							lessonTimeInMinutes: true
						}
					}
				}
			}
		}
	});

	if (!invoice) {
		throw error(404, 'Skater invoice not found');
	}

	const { lessons, chargesTotal } = invoice.skaterLessons.reduce(
		(
			acc,
			{
				Lesson: {
					skaters: { length: numberOfSkaters },
					lessonCostPerSkaterInCents,
					date,
					lessonTimeInMinutes
				}
			}
		) => {
			acc.lessons.push({ numberOfSkaters, lessonCostPerSkaterInCents, date, lessonTimeInMinutes });
			acc.chargesTotal += lessonCostPerSkaterInCents;
			return acc;
		},
		{ lessons: [] as Lesson[], chargesTotal: 0 }
	);

	return { invoice, lessons, chargesTotal };
};
