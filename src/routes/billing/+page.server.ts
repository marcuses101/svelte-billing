import { generateBillingBatch } from '$lib/server/generateBillingBatch';
import type { Actions } from './$types';

export const actions = {
	generateBills: async () => {
		try {
			await generateBillingBatch();
			return { success: true };
		} catch (e) {
			console.log(e);
			return { error: true };
		}
	}
} satisfies Actions;
