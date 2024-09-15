import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async ({ url }) => {
	const userId = url.searchParams.get('user-id');
	if (typeof userId !== 'string') {
		return error(400, 'invalid query parameters');
	}
	const token = url.searchParams.get('token');
	if (typeof token !== 'string') {
		return error(400, 'invalid query parameters');
	}
	const user = await prisma.user.findUnique({
		where: { id: userId, EmailConfirmationToken: { token } },
		include: { EmailConfirmationToken: true }
	});
	if (!user) {
		return error(403, `Invalid user-token combination`);
	}
	try {
		await prisma.user.update({
			where: { id: userId },
			data: { emailConfirmation: 'Confirmed', confirmationEmailDeliveryStatus: 'Delivered' }
		});
		return { email: user.email };
	} catch (e) {
		console.error(e);
		return error(500, 'failed to update user email confirmation status');
	}
};
