import { prisma } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const invoices = await prisma.invoice.findMany({ where: { skaterId: params.id } });
	return { invoices };
};
