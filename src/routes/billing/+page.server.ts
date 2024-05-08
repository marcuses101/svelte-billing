import { wrapErr } from '$lib/rustResult';
import { generateBillingBatch } from '$lib/server/generateBillingBatch';
import type { Actions } from './$types';

export const actions = {
	generateBills: async () => {
		try {
			const data = await generateBillingBatch();
			return data;
		} catch (e) {
			console.log(e);
			return wrapErr({ message: 'An unknown error occured' });
		}
	}
} satisfies Actions;
