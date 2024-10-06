import { fail } from '@sveltejs/kit';
import { addSkater } from '$lib/server/db';
import type { Actions } from './$types';
import { validateSkaterForm } from './validateSkaterForm';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const validationResult = validateSkaterForm(data);
		if (!validationResult.ok) {
			return fail(400, {
				succeeded: false,
				missingFields: validationResult.error.missingFields
			});
		}
		const { firstName, lastName, email, skaterTypeCode } = validationResult.value;

		const skater = await addSkater(firstName, lastName, email, skaterTypeCode);
		return { success: true, skater };
	}
} satisfies Actions;
