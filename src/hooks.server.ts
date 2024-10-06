import { error, redirect, type Handle } from '@sveltejs/kit';
import { handle as authenticationHandle } from './auth';
import { sequence } from '@sveltejs/kit/hooks';
import { LOGIN_PATHNAME, ROLES } from '$lib/defs';

const authorizationHandle: Handle = async ({ event, resolve }) => {
	if (!event.url.pathname.includes('protected')) {
		return resolve(event);
	}
	const session = await event.locals.auth();
	const user = session?.user;
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

export const handle: Handle = sequence(authenticationHandle, authorizationHandle);
