import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	default: (event) => {
		event.cookies.delete('user_id', { path: '/' });
		event.locals.user = null;
		throw redirect(303, '/');
	}
} satisfies Actions;
