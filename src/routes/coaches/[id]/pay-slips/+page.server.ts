import { prisma } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params: { id } }) => {
	const coach = await prisma.coach.findUnique({
		where: { id },
		include: {
			CoachPaySlips: { include: { CoachPaySlipLineItems: true } },
			User: { select: { firstName: true, lastName: true } }
		}
	});
	if (!coach) {
		return error(404, `Coach with id ${id} not found`);
	}
	return { coach };
};
