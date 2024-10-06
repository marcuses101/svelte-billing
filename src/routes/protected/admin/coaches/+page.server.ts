import { prisma } from '$lib/server/db';

export async function load() {
	const data = await prisma.user.findMany({
		include: { Coach: true },
		orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
		where: { Coach: { isNot: null } }
	});

	const coaches = data.map(
		({
			firstName,
			lastName,
			email,
			Coach,
			emailConfirmation,
			confirmationEmailDeliveryStatus
		}) => ({
			firstName,
			lastName,
			id: Coach?.id!,
			email,
			emailConfirmation,
			confirmationEmailDeliveryStatus
		})
	);
	return { coaches };
}
