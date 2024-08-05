import { sendEmail } from '$lib/emailClient';
import type { Actions } from './$types';

export const actions = {
	default: async ({ fetch }) => {
		const emailResult = await sendEmail(
			fetch,
			'info@tlss.ca',
			'Test Email',
			'this is the body of the test email'
		);
		return emailResult;
	}
} satisfies Actions;
