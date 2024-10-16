import { error, redirect, type Handle } from '@sveltejs/kit';
import { handle as authenticationHandle } from './auth';
import { sequence } from '@sveltejs/kit/hooks';
import { LOGIN_PATHNAME, ROLES } from '$lib/defs';
import { loggerHandle } from '$lib/server/logger';

const authorizationHandle: Handle = async ({ event, resolve }) => {
	const session = await event.locals.auth();
	const user = session?.user;
	const childLogger = user
		? event.locals.logger.child({
				authenticated: true,
				userEmail: user.email,
				userId: user.id,
				userRoles: user.UserRoles.map((userRoleEntry) => userRoleEntry.roleName)
			})
		: event.locals.logger.child({
				authenticated: false
			});
	event.locals.logger = childLogger;
	childLogger.info('request started');

	if (!event.url.pathname.includes('protected')) {
		return resolve(event);
	}
	if (!user) {
		const searchParams = new URLSearchParams();
		searchParams.set('callbackUrl', event.url.pathname);
		const redirectPath = `${LOGIN_PATHNAME}?${searchParams.toString()}`;
		return redirect(303, redirectPath);
	}
	const isAdminRoute = event.url.pathname.startsWith('/admin');
	const isUserAdmin = user.UserRoles.some((entry) => entry.roleName === ROLES.ADMIN);
	if (isAdminRoute && !isUserAdmin) {
		error(403, 'You are not authorized to access this route');
	}

	return resolve(event);
};

const responseLogHandle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	const statusCode = response.status;
	event.locals.logger.info({ statusCode }, 'request complete');
	return response;
};

export const handle: Handle = sequence(
	loggerHandle,
	authenticationHandle,
	authorizationHandle,
	responseLogHandle
);
