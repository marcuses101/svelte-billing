import { prisma } from '$lib/server/db';

export async function load() {
	const data = await prisma.user.findMany({
		orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
		where: { Coach: { isNot: null } }
	});
	const coaches = data.map(({ firstName, lastName, id }) => ({ firstName, lastName, id }));
	return { coaches };
}
