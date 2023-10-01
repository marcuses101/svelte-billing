import type { PageServerLoad } from './$types';
import { getSkaterById } from '$lib/server/db';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = ({ params }) => {
	const skater = getSkaterById(params.id);
	if (!skater) {
		throw error(404);
	}
	return { skater };
};
