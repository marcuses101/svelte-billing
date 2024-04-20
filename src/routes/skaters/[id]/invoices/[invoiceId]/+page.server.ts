import { prisma } from '$lib/server/db';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const invoice = await prisma.invoice.findUnique({
		where: { id: params.invoiceId, skaterId: params.id },
		include: {
			InvoiceLineItems: {
				orderBy: [{ date: 'asc' }]
			}
		}
	});

	if (!invoice) {
		error(404, 'Skater invoice not found');
	}

	const lessonsTotalInCents = invoice.InvoiceLineItems?.reduce(
		(acc, { amountInCents }) => (acc += amountInCents),
		0
	);

	return { invoice, lessonsTotalInCents };
};
