import { generateInvoiceBatch } from '$lib/server/generateInvoiceBatch';
import type { Actions } from './$types';

export const actions = {
	generateBills: async (event) => {
		try {
			await generateInvoiceBatch();
			return { success: true };
		} catch (e) {
			console.log(e);
			return { error: true };
		}
	}
} satisfies Actions;
