import { getCoachWithInfoForPayslipById } from '$lib/getCoachesWithInfoForPayslip';
import { prisma } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { processCoachForPaySlip } from '$lib/processCoachForPaySlip';

export const load: PageServerLoad = async ({ params, locals }) => {
	console.log('current pay slip');
	const coachWithPaySlipInfo = await getCoachWithInfoForPayslipById(prisma, params.id);
	if (!coachWithPaySlipInfo) {
		return error(404, `Coach with id ${params.id} not found`);
	}
	const paySlip = processCoachForPaySlip(coachWithPaySlipInfo, locals.logger);
	return { paySlip };
};
