import { redirect, type Handle } from '@sveltejs/kit';
import { handle as authenticationHandle } from './auth';
import { sequence } from '@sveltejs/kit/hooks';

const publicRoutes = ['/', '/login', '/about', '/lessons/calculator'];

const authorizationHandle: Handle = async ({ event, resolve }) => {
	if (publicRoutes.includes(event.url.pathname)) {
		return resolve(event);
	}
	const session = await event.locals.auth();
	const user = session?.user;
	if (user) {
		return resolve(event);
	}
	throw redirect(303, '/login');
};

export const handle: Handle = sequence(authenticationHandle, authorizationHandle);
