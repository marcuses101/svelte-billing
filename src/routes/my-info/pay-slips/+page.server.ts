import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth();
	const user = session?.user;
	if (!user || !user.Coach) {
		return error(403);
	}
	const paySlips = await prisma.coachPaySlip.findMany({ where: { coachId: user.Coach.id } });
	return { paySlips };
};
