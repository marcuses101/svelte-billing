import { prisma } from './db';

export async function generateInvoiceBatch() {
	console.log('generate invoices');
	return prisma.$transaction(async (tx) => {
		const unInvoicedSkaterLessons = await tx.skaterLesson.findMany({
			where: { invoiceId: null }
		});
		if (unInvoicedSkaterLessons.length === 0) {
			console.log('No uninvoiced lessons found');
			return;
		}
		const lessonsBySkater = unInvoicedSkaterLessons.reduce((acc, current) => {
			const ids = acc.get(current.skaterId) ?? [];
			ids.push(current.lessonId);
			acc.set(current.skaterId, ids);
			return acc;
		}, new Map<string, string[]>());
		const invoiceBatch = await tx.invoiceBatch.create({ data: {} });

		for await (const [skaterId, lessonIds] of lessonsBySkater) {
			const invoice = await tx.invoice.create({
				data: {
					InvoiceBatch: { connect: { id: invoiceBatch.id } },
					invoiceDate: new Date(),
					createdOn: new Date(),
					skater: { connect: { id: skaterId } },
					skaterLessons: {
						connect: lessonIds.map((lessonId) => ({ skaterId_lessonId: { skaterId, lessonId } }))
					}
				}
			});
			console.log(invoice);
		}
		console.log('invoice generation complete');
	});
}
