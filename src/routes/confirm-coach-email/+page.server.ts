import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async ({ url }) => {
	const coachUserId = url.searchParams.get('user-id');
	if (typeof coachUserId !== 'string') {
		return error(400, 'invalid query parameters');
	}
	const token = url.searchParams.get('token');
	if (typeof token !== 'string') {
		return error(400, 'invalid query parameters');
	}
	const coachUser = await prisma.user.findUnique({
		where: { id: coachUserId, EmailConfirmationToken: { isNot: null } },
		include: { EmailConfirmationToken: true }
	});
	if (!coachUser) {
		return error(
			400,
			`Coach with id ${coachUserId} not found, or has no associated confirmation token`
		);
	}
	if (coachUser.EmailConfirmationToken?.token !== token) {
		return error(400, 'Invalid Token');
	}
	try {
		await prisma.user.update({
			where: { id: coachUserId },
			data: { emailConfirmation: 'Confirmed' }
		});
		return { email: coachUser.email };
	} catch (e) {
		console.error(e);
		return error(500, 'failed to update coach email confirmation status');
	}
};
