import { getCoachWithInfoForPayslipById } from '$lib/getCoachesWithInfoForPayslip';
import { prisma } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { processCoachForPaySlip } from '$lib/processCoachForPaySlip';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth();
	const user = session?.user;
	const coachId = user?.Coach?.id;
	if (!coachId) {
		locals.logger.warn('Non coach user accessing coach preview page');
		error(401, 'Restricted to coaches');
	}
	const coachWithPaySlipInfo = await getCoachWithInfoForPayslipById(prisma, coachId);
	if (!coachWithPaySlipInfo) {
		locals.logger.error(`getCoachWithInfoForPayslipById could not find coachId: ${coachId}`);
		return error(404, `Coach with id ${coachId} not found`);
	}
	const paySlip = processCoachForPaySlip(coachWithPaySlipInfo);
	return { paySlip };
};
