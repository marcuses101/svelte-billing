import { prisma } from '$lib/server/db';

export async function load() {
	const data = await prisma.user.findMany({
		include: { Coach: true },
		orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
		where: { Coach: { isNot: null } }
	});
	// TODO fix coach should look up based on coach Id, not user id

	const coaches = data.map(({ firstName, lastName, Coach }) => ({
		firstName,
		lastName,
		id: Coach?.id!
	}));
	return { coaches };
}
