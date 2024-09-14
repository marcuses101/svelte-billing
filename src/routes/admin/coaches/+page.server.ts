import { prisma } from '$lib/server/db';
import { error, fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { sendCoachEmailConfirmation } from '$lib/features/email/sendCoachEmailConfirmation';

export async function load() {
	const data = await prisma.user.findMany({
		include: { Coach: true },
		orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
		where: { Coach: { isNot: null } }
	});

	const coaches = data.map(
		({
			firstName,
			lastName,
			email,
			Coach,
			emailConfirmation,
			confirmationEmailDeliveryStatus
		}) => ({
			firstName,
			lastName,
			id: Coach?.id!,
			email,
			emailConfirmation,
			confirmationEmailDeliveryStatus
		})
	);
	return { coaches };
}

export const actions = {
	'send-confirmation': async ({ request, fetch }) => {
		const formData = await request.formData();
		const coachId = formData.get('coach-id');
		if (typeof coachId !== 'string') {
			return fail(400, { message: 'coachId is required' });
		}
		const sendResponse = await sendCoachEmailConfirmation(fetch, coachId);
		if (!sendResponse.ok) {
			error(500, sendResponse.error.message);
		}
		return sendResponse;
	}
} satisfies Actions;
