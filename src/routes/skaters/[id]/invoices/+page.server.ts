import type { PageServerLoad } from './$types';
import { getSkaterById } from '$lib/server/db';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const skater = await getSkaterById(params.id);
	if (!skater) {
		throw error(404);
	}
	return { skater };
};
