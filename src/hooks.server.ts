import { error, redirect, type Handle } from '@sveltejs/kit';
import { handle as authenticationHandle } from './auth';
import { sequence } from '@sveltejs/kit/hooks';
import { ROLES } from '$lib/defs';

// todo, invert this
const publicRoutes = [
	'/',
	'/login',
	'logout',
	'/about',
	'/lessons/calculator',
	'/confirm-user-email',
	'/invoice',
	'/password-reset',
	'/password-reset-request',
	'/favicon.ico'
];

const authorizationHandle: Handle = async ({ event, resolve }) => {
	if (publicRoutes.includes(event.url.pathname)) {
		return resolve(event);
	}
	const session = await event.locals.auth();
	const user = session?.user;
	if (!user) {
		const searchParams = new URLSearchParams();
		searchParams.set('callbackUrl', event.url.pathname);
		const redirectPath = `/auth/signin?${searchParams.toString()}`;
		return redirect(303, redirectPath);
	}
	const isAdminRoute = event.url.pathname.startsWith('/admin');
	const isUserAdmin = user.UserRoles.some((entry) => entry.roleName === ROLES.ADMIN);
	if (isAdminRoute && !isUserAdmin) {
		error(403, 'You are not authorized to access this route');
	}

	return resolve(event);
};

export const handle: Handle = sequence(authenticationHandle, authorizationHandle);
