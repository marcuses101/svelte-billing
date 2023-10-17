import { prisma } from '$lib/server/db';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const cookieId = event.cookies.get('user_id');
	if (cookieId) {
		const user = await prisma.user.findUnique({
			where: { id: event.cookies.get('user_id') },
			include: { Coach: true }
		});
		event.locals.user = user;
	} else {
		event.locals.user = null;
	}
	const response = await resolve(event);
	return response;
};
