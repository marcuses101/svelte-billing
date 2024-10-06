import { getPayslipById } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params: { paySlipId } }) => {
	const session = await locals.auth();
	const coach = session?.user.Coach;
	if (!coach) {
		return error(403);
	}
	const paySlip = await getPayslipById(paySlipId);
	if (!paySlip) {
		return error(404, { message: `Pay slip with the id: ${paySlipId} not found` });
	}
	if (paySlip.coachId !== coach.id) {
		return error(403);
	}
	return { paySlip };
};
