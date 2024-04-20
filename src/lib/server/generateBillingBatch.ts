import { wrapOk, type Result, makeSafe } from '$lib/rustResult';
import type { BillingBatch } from '@prisma/client';
import { prisma } from './db';

function getUnInvoicedLessons() {
	return makeSafe(async () => {
		return prisma.lesson.findMany({
			include: {
				SkaterLessons: true,
				Coach: { include: { user: { select: { firstName: true, lastName: true } } } }
			}
		});
	})();
}

export function getLineItemDescription(
	numberOfSkaters: number,
	lessonTimeInMinutes: number,
	coachName: string
) {
	if (numberOfSkaters === 1) {
		return `${lessonTimeInMinutes} minute private lesson (${coachName})`;
	}
	return `${lessonTimeInMinutes} minute group lesson (${coachName})`;
}

type SkaterLessonEntry = {
	date: Date;
	lessonCostPerSkaterInCents: number;
	lessonTimeInMinutes: number;
	coachName: string;
	lineItemDescription: string;
};

type Invoice = {
	id: string;
	invoiceDate: Date;
	skaterId: string;
	createdOn: Date;
	modifiedOn: Date | null;
	invoiceBatchId: string | null;
	InvoiceLineItems: {
		id: string;
		date: Date;
		description: string;
		amountInCents: number;
	}[];
};

export async function generateBillingBatch(
	invoiceDate: Date = new Date()
): Promise<Result<BillingBatch & { Invoices: Invoice[] }>> {
	const lessonsResult = await getUnInvoicedLessons();
	if (!lessonsResult.ok) {
		return lessonsResult;
	}
	const lessons = lessonsResult.value;

	const skaterLessonsMap = lessons.reduce((acc, lesson) => {
		const { date, SkaterLessons, lessonCostPerSkaterInCents, lessonTimeInMinutes, Coach } = lesson;
		const coachName = `${Coach.user.firstName} ${Coach.user.lastName}`;
		const numberOfSkaters = SkaterLessons.length;
		SkaterLessons.forEach(({ skaterId }) => {
			const skaterLessonEntries = acc.get(skaterId) ?? [];
			skaterLessonEntries.push({
				date,
				lessonTimeInMinutes,
				lessonCostPerSkaterInCents,
				coachName,
				lineItemDescription: getLineItemDescription(numberOfSkaters, lessonTimeInMinutes, coachName)
			});
			acc.set(skaterId, skaterLessonEntries);
		});
		return acc;
	}, new Map<string, SkaterLessonEntry[]>());

	const billingBatch = await prisma.billingBatch.create({ data: {} });

	const invoices: Invoice[] = [];

	for (const [skaterId, lessons] of skaterLessonsMap) {
		const newInvoice = await prisma.invoice.create({
			data: {
				invoiceBatchId: billingBatch.id,
				skaterId,
				invoiceDate,
				InvoiceLineItems: {
					createMany: {
						data: lessons.map(({ date, lineItemDescription, lessonCostPerSkaterInCents }) => ({
							amountInCents: lessonCostPerSkaterInCents,
							description: lineItemDescription,
							date
						}))
					}
				}
			},
			include: {
				InvoiceLineItems: {
					select: { id: true, description: true, amountInCents: true, date: true }
				}
			}
		});
		invoices.push(newInvoice);
	}
	const populatedBillingBatch = await prisma.billingBatch.findUniqueOrThrow({
		where: { id: billingBatch.id },
		include: {
			Invoices: {
				include: { InvoiceLineItems: true, Skater: { select: { firstName: true, lastName: true } } }
			}
		}
	});

	return wrapOk(populatedBillingBatch);
}
