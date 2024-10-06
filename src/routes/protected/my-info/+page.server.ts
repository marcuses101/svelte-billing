import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getCoachById } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth();
	const coachId = session?.user.Coach?.id;
	if (!coachId) {
		return error(401);
	}
	const coach = await getCoachById(coachId);
	if (!coach) {
		return error(404);
	}
	return { coach };
};
