import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

const publicRoutes = ['/', '/login', '/about'];

export const load: LayoutServerLoad = ({ locals, url }) => {
	if (locals.user) {
		return { user: locals.user };
	}
	if (publicRoutes.includes(url.pathname)) {
		return;
	}
	return redirect(302, '/login');
};
