import { prisma } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getSkaterWithUnInvoicedLessonsById } from '$lib/getSkatersWithUninvoicedLessons';
import { processSkaterInfoForInvoice } from '$lib/processSkaterInfoForInvoice';

export const load: PageServerLoad = async ({ params }) => {
	const skaterInfo = await getSkaterWithUnInvoicedLessonsById(prisma, params.id);
	if (!skaterInfo) {
		return error(404, `Skater with id ${params.id} not found`);
	}
	const processedInvoice = processSkaterInfoForInvoice(skaterInfo);

	return { processedInvoice };
};
