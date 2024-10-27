import { prisma } from './db';
import { wrapErr, wrapOk } from '$lib/rustResult';
import { generateSkaterInvoices } from './generateSkaterInvoices';
import { generateCoachPaySlips } from './generateCoachPaySlips';
import type { Logger } from 'pino';

export async function generateBillingBatch(invoiceDate: Date = new Date(), logger: Logger) {
	return prisma.$transaction(async (tx) => {
		// Get Skater Lessons
		const billingBatch = await tx.billingBatch.create({ data: {} });
		const invoices = await generateSkaterInvoices(tx, invoiceDate, billingBatch.id);
		if (invoices.length === 0) {
			await tx.billingBatch.delete({ where: { id: billingBatch.id } });
			return wrapErr({ message: 'No un-invoiced Skater Lessons found' });
		}
		await generateCoachPaySlips(tx, billingBatch.id, logger);

		const populatedBillingBatch = await tx.billingBatch.findUniqueOrThrow({
			where: { id: billingBatch.id },
			include: {
				Invoices: {
					include: {
						InvoiceLineItems: true,
						Skater: { select: { firstName: true, lastName: true } }
					}
				}
			}
		});

		return wrapOk(populatedBillingBatch);
	});
}
