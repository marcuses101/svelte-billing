import { prisma } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const invoices = await prisma.invoice.findMany({
		orderBy: { invoiceDate: 'desc' },
		include: {
			Skater: {
				select: {
					firstName: true,
					lastName: true,
					id: true
				}
			}
		}
	});
	return { invoices };
};
