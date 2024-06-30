import { getPayslipById } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params: { paySlipId } }) => {
	const paySlip = await getPayslipById(paySlipId);
	if (!paySlip) {
		error(404, { message: `Pay slip with the id: ${paySlipId} not found` });
	}
	return { paySlip };
};
