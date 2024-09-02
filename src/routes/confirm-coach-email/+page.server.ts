import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async ({ url }) => {
	const coachId = url.searchParams.get('coach-id');
	if (typeof coachId !== 'string') {
		return error(400, 'invalid query parameters');
	}
	const token = url.searchParams.get('token');
	if (typeof token !== 'string') {
		return error(400, 'invalid query parameters');
	}
	const coach = await prisma.coach.findUnique({
		where: { id: coachId, User: { EmailConfirmationToken: { isNot: null } } },
		include: { User: { include: { EmailConfirmationToken: true } } }
	});
	if (!coach) {
		return error(
			400,
			`Coach with id ${coachId} not found, or has no associated confirmation token`
		);
	}
	if (coach.User.EmailConfirmationToken?.token !== token) {
		return error(400, 'Invalid Token');
	}
	try {
		await prisma.coach.update({
			where: { id: coachId },
			data: { User: { update: { emailConfirmation: 'Confirmed' } } }
		});
		return { email: coach.User.email };
	} catch {
		return error(500, 'failed to update coach email confirmation status');
	}
};
