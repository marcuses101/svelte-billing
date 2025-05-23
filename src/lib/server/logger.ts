import type { Handle } from '@sveltejs/kit';
import pino, { type Level } from 'pino';
import { PINO_LOGGING_LEVEL } from '$env/static/private';

const loggerLevels: string[] = [
	'fatal',
	'error',
	'warn',
	'info',
	'debug',
	'trace'
] satisfies Level[];

const level = loggerLevels.includes(PINO_LOGGING_LEVEL ?? '') ? PINO_LOGGING_LEVEL : 'info';
console.log('PINO LOGGING LEVEL', level.toUpperCase());

export const logger = pino(pino.destination({ level, dest: './logs' }));

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
