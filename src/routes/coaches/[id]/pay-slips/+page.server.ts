import { prisma } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getCoachWithInfoForPayslipById } from '$lib/getCoachesWithInfoForPayslip';
import { processCoachForPaySlip } from '$lib/processCoachForPaySlip';

export const load: PageServerLoad = async ({ params: { id } }) => {
	const coach = await prisma.coach.findUnique({
		where: { id },
		include: {
			CoachPaySlips: { include: { CoachPaySlipLineItems: true } },
			User: { select: { firstName: true, lastName: true } }
		}
	});
	const coachWithPaySlipInfo = await getCoachWithInfoForPayslipById(prisma, id);
	if (!coachWithPaySlipInfo || !coach) {
		return error(404, `Coach with id ${id} not found`);
	}
	const paySlip = processCoachForPaySlip(coachWithPaySlipInfo);
	const currentPeriodAmount = paySlip.amountDueInCents;
	return { coach, currentPeriodAmount };
};
