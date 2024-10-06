import { getPayslipById } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params: { id } }) => {
	const paySlip = await getPayslipById(id);
	if (!paySlip) {
		error(404, { message: `Pay slip with the id: ${id} not found` });
	}
	return { paySlip };
};
