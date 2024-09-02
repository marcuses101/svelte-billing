import { error, redirect, type Handle } from '@sveltejs/kit';
import { handle as authenticationHandle, InvalidLoginError } from './auth';
import { sequence } from '@sveltejs/kit/hooks';
import { ROLES } from '$lib/defs';

const publicRoutes = [
	'/',
	'/login',
	'logout',
	'/about',
	'/lessons/calculator',
	'/confirm-coach-email',
	'/confirm-skater-email'
];

const authorizationHandle: Handle = async ({ event, resolve }) => {
	if (publicRoutes.includes(event.url.pathname)) {
		return resolve(event);
	}
	const session = await event.locals.auth();
	const user = session?.user;
	if (!user) {
		return redirect(303, '/login');
	}
	const isAdminRoute = event.url.pathname.startsWith('/admin');
	const isUserAdmin = user.UserRoles.some((entry) => entry.roleName === ROLES.ADMIN);
	if (isAdminRoute && !isUserAdmin) {
		error(403, 'You are not authorized to access this route');
	}

	return resolve(event);
};

function handleInvalidCredentials() {
	const error = new InvalidLoginError();
	const invalidLoginParams = new URLSearchParams();
	invalidLoginParams.set('error', error.name);
	invalidLoginParams.set('code', error.code);
	return redirect(301, `/login?${invalidLoginParams.toString()}`);
}

export const handle: Handle = sequence(authenticationHandle, authorizationHandle);
