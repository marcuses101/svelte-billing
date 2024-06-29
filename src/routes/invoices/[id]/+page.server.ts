import { getInvoiceById } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const invoice = await getInvoiceById(params.id);
	if (!invoice) {
		error(404, { message: `Invoice with ID: ${params.id} not found` });
	}
	return { invoice };
};
