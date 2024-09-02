import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async ({ url }) => {
	const skaterId = url.searchParams.get('skater-id');
	if (typeof skaterId !== 'string') {
		return error(400, 'invalid query parameters');
	}
	const token = url.searchParams.get('token');
	if (typeof token !== 'string') {
		return error(400, 'invalid query parameters');
	}
	const skater = await prisma.skater.findUnique({
		where: { id: skaterId, EmailConfirmationToken: { isNot: null } },
		include: { EmailConfirmationToken: true }
	});
	if (!skater) {
		return error(
			400,
			`skater with id ${skaterId} not found, or has no associated confirmation token`
		);
	}
	if (skater.EmailConfirmationToken?.token !== token) {
		return error(400, 'Invalid Token');
	}
	try {
		await prisma.skater.update({
			where: { id: skaterId },
			data: { emailConfirmation: 'Confirmed' }
		});
		return { email: skater.email };
	} catch {
		return error(500);
	}
};
