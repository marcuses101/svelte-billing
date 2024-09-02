import { prisma } from '$lib/server/db';
import { error, fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { sendSkaterEmailConfirmation } from './sendSkaterEmailConfirmation';

export async function load() {
	const skaters = await prisma.skater.findMany({
		orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }]
	});
	return { skaters };
}

export const actions = {
	'send-confirmation': async ({ request, fetch }) => {
		const formData = await request.formData();
		const skaterId = formData.get('skater-id');
		if (typeof skaterId !== 'string') {
			return fail(400, { message: 'skaterId is required' });
		}
		const sendResponse = await sendSkaterEmailConfirmation(fetch, skaterId);
		if (!sendResponse.ok) {
			error(500, sendResponse.error);
		}
		return sendResponse;
	}
} satisfies Actions;
