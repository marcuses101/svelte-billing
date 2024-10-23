import { prisma } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const invoices = await prisma.skaterInvoice.findMany({
		where: { skaterId: params.id }
	});
	return { invoices };
};
