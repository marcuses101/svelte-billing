import type { Handle } from '@sveltejs/kit';
import pino from 'pino';

export const logger = pino({});

export const loggerHandle: Handle = async ({ event, resolve }) => {
	const requestId = crypto.randomUUID();
	const childLogger = logger.child({
		requestId,
		pathname: event.url.pathname,
		method: event.request.method
	});
	event.locals.requestId = requestId;
	event.locals.logger = childLogger;
	return resolve(event);
};
