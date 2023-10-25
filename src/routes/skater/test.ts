import { prisma } from '$lib/server/db';

export function load() {
	const skaters = prisma.skater.findMany({ orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }] });
	return { skaters };
}
