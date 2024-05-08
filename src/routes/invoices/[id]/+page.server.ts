import { prisma } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const invoice = await prisma.invoice.findUnique({
		where: { id: params.id },
		include: { Skater: { select: { firstName: true, lastName: true } }, InvoiceLineItems: true }
	});

	if (!invoice) {
		error(404, { message: `Invoice with ID: ${params.id} not found` });
	}
	return { invoice };
};
