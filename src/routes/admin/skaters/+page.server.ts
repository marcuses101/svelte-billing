import { prisma } from '$lib/server/db';

export async function load() {
	const skaters = await prisma.skater.findMany({
		orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }]
	});
	return { skaters };
}
