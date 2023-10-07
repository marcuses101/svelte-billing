import { fail } from '@sveltejs/kit';
import { addSkater } from '$lib/server/db';
import type { Actions } from './$types';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const firstName = data.get('first-name');
		const lastName = data.get('last-name');
		const email = data.get('email');
		if (!firstName) {
			return fail(400, { firstName, missing: true });
		}
		if (!lastName) {
			return fail(400, { lastName, missing: true });
		}

		const skater = await addSkater(firstName as string, lastName as string, email as string);
		return { success: true, skater };
	}
} satisfies Actions;
