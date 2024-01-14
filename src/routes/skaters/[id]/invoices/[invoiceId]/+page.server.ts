import { prisma } from '$lib/server/db';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const invoice = await prisma.invoice.findUnique({
		where: { id: params.invoiceId, skaterId: params.id }
	});
	if (!invoice) {
		throw error(404, 'Skater invoice not found');
	}
	return { invoice };
};
