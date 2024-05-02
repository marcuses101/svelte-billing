import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

const publicRoutes = ['/', '/login', '/about'];

export const load: LayoutServerLoad = ({ locals, url }) => {
	if (!locals.user && !publicRoutes.includes(url.pathname)) {
		return redirect(302, '/login');
	}

	return { user: locals.user };
};
