import { prisma } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const paySlips = await prisma.coachPaySlip.findMany({
		orderBy: { date: 'desc' },
		include: {
			CoachPaySlipLineItems: true,
			Coach: { select: { id: true, User: { select: { firstName: true, lastName: true } } } }
		}
	});
	console.log(paySlips);
	return { paySlips };
};
