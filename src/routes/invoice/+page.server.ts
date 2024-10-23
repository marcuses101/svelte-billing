import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async ({ url }) => {
	const skaterId = url.searchParams.get('skater-id');
	const invoiceId = url.searchParams.get('invoice-id');
	if (!skaterId || !invoiceId) {
		return error(404);
	}
	const invoice = await prisma.skaterInvoice.findUnique({
		where: { id: invoiceId, skaterId },
		include: { Skater: true, InvoiceLineItems: true, SkaterPaymentAccountTransactions: true }
	});
	if (!invoice) {
		return error(404);
	}
	return { invoice };
};
