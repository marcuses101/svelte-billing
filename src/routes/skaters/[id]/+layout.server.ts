import type { LayoutServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import { error } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ params }) => {
	const skaterInfo = await prisma.skater.findUnique({
		where: { id: params.id }
	});
	if (!skaterInfo) {
		throw error(404);
	}

	return { skater: skaterInfo };
};
