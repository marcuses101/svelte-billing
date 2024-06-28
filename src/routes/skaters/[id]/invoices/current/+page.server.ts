import { calculateLessonQuery, lastInvoiceQuery, prisma } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { InvoiceLineItem } from '@prisma/client';
import { calculateLesson } from '$lib/calculateLessonCost';
import { ACCOUNT_TRANSACTION_TYPE } from '$lib/defs';
import { formatSkaterLineItemDescription } from '$lib/server/generateSkaterInvoices';

export const load: PageServerLoad = async ({ params }) => {
	const skaterInfo = await prisma.skater.findUnique({
		where: { id: params.id },
		include: {
			Account: {
				include: {
					AccountTransaction: {
						where: {
							accountTransactionTypeCode: ACCOUNT_TRANSACTION_TYPE.STUDENT_PAYMENT,
							PaymentRecordedInvoice: { is: null }
						}
					}
				}
			},
			Invoices: lastInvoiceQuery,
			SkaterLessons: {
				where: { InvoiceLineItems: null },
				select: {
					Lesson: calculateLessonQuery
				}
			}
		}
	});

	if (!skaterInfo) {
		error(404);
	}

	const { SkaterLessons: rawLessons, Invoices, ...skater } = skaterInfo;
	const lineItems: InvoiceLineItem[] = rawLessons.map(({ Lesson: lesson }) => {
		const numberOfSkaters = lesson._count.SkaterLessons;
		const { skatersWithCost } = calculateLesson(lesson);
		const skaterCost = skatersWithCost.find((entry) => {
			return entry.skaterId === params.id;
		});
		console.log(skatersWithCost, params.id, skaterCost);
		if (!skaterCost) {
			throw new Error('skater cost not found');
		}
		const lessonTimeInMinutes = lesson.lessonTimeInMinutes;

		const { firstName, lastName } = lesson.Coach.User;
		const coachName = `${firstName} ${lastName}`;
		const description = formatSkaterLineItemDescription(
			numberOfSkaters,
			lessonTimeInMinutes,
			coachName
		);
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

	return { skater, lineItems, lastInvoice: Invoices[0], skaterInfo };
};
