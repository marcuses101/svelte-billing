import { getCoachById } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params: { id } }) => {
	const coach = await getCoachById(id);
	if (!coach) {
		error(404, `Coach with id ${id} not found`);
	}
	return { coach };
};
