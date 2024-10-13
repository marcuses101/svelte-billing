import type { Handle } from '@sveltejs/kit';
import pino from 'pino';

export const logger = pino({});

export const loggerHandle: Handle = async ({ event, resolve }) => {
	event.locals.logger = logger;
	return resolve(event);
	const session = await event.locals.auth();
	const user = session?.user;
	const { pathname } = event.url;
	const method = event.request.method;
	if (!user) {
		const childLogger = logger.child({ authenticated: false, pathname, method });
		event.locals.logger = childLogger;
		return resolve(event);
	}
	const childLogger = logger.child({
		authenticated: true,
		pathname,
		method,
		userId: user.id,
		userEmail: user.email
	});
	event.locals.logger = childLogger;
	return resolve(event);
};
