import { dev } from '$app/environment';
import { prisma } from '$lib/server/db';
import { redirect, type Actions, fail } from '@sveltejs/kit';

export const actions = {
	default: async ({ cookies, request }) => {
		const formData = await request.formData();
		const email: FormDataEntryValue | null = formData.get('email');
		if (typeof email !== 'string') {
			return fail(400, { success: false, message: 'email must be of type string' });
		}
		if (email.length === 0) {
			return fail(400, { success: false, message: 'invalid email' });
		}
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return fail(400, { success: false, message: `no user found with email: ${email}` });
		}

		cookies.set('user_id', user.id, { path: '/', secure: !dev });
		redirect(303, '/');
	}
} satisfies Actions;
