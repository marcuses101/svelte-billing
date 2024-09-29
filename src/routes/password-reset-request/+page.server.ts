import { randomBytes } from 'crypto';
import { error, fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { hash } from 'bcrypt';
import { addHours } from 'date-fns';
import { wrapErr, wrapOk, type Result } from '$lib/rustResult';
import { sendPasswordResetEmail } from '$lib/features/email/sendPasswordReset';
import { prisma } from '$lib/server/db';
import { SendEmailError } from '$lib/features/email/emailClient';

type PasswordResetRequestError = { type: 'MISSING_EMAIL' };

function validate(formData: FormData): Result<{ email: string }, PasswordResetRequestError> {
	const email = formData.get('email');
	if (typeof email !== 'string') {
		return wrapErr({ type: 'MISSING_EMAIL' });
	}
	return wrapOk({ email });
}

export const actions = {
	default: async ({ request, fetch }) => {
		const formData = await request.formData();
		const validationResponse = validate(formData);
		if (!validationResponse.ok) {
			return fail(400, validationResponse);
		}
		const { email } = validationResponse.value;
		const user = await prisma.user.findUnique({ where: { email } });
		if (user === null) {
			console.log(`user with email "${email}" not found`);
			return wrapOk({ email });
		}
		const token = randomBytes(32).toString('hex');
		const hashedPasswordResetToken = await hash(token, 10);
		const passwordResetExpiry = addHours(new Date(), 1);

		// should display ok even if user is not found

		const prismaResponse = await prisma
			.$transaction(async (tx) => {
				const user = await tx.user.update({
					where: { email },
					data: { passwordResetExpiry, hashedPasswordResetToken }
				});
				const sendResponse = await sendPasswordResetEmail(fetch, email, token);
				if (!sendResponse.ok) {
					throw new SendEmailError(sendResponse.error);
				}
				return wrapOk(user);
			})
			.catch((e) => {
				if (e instanceof SendEmailError) {
					return wrapErr({ type: 'SEND_EMAIL_ERROR' as const, message: e.message });
				}
				return wrapErr({ type: 'PRISMA_ERROR' as const, message: e.message });
			});
		if (!prismaResponse.ok) {
			return error(500, {
				message:
					'Failed to update password. Please try again later or contact an Administrator if the problem persists'
			});
		}
		console.log('password reset email sent to %s', email);
		return wrapOk({ email });
	}
} satisfies Actions;
