import { redirect } from '@sveltejs/kit';
import { validateRole } from './validateRole';

export async function validateUserIsAdmin(locals: App.Locals) {
	const session = await locals.auth();
	const user = session?.user;
	if (!user) {
		return redirect(303, '/login');
	}
	const isAdmin = validateRole(user, 'ADMIN');
	return isAdmin;
}
