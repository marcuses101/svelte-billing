import { fail } from '@sveltejs/kit';
import { addLesson, getSkaters } from '$lib/server/db';
import type { Actions } from './$types';

export function load() {
	return { skaters: getSkaters() };
}

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const minutes = data.get('minutes');
		const skaterIds = data.getAll('skater');
		const date = data.get('date');
		addLesson();

		return fail(501);
	}
} satisfies Actions;
