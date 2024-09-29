import { wrapErr, wrapOk, type Result } from '$lib/rustResult';
import { compare, hash } from 'bcrypt';
import type { PageServerLoad } from './$types';
import { error, fail, type Actions } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get('token');
	if (typeof token !== 'string') {
		error(400, { message: 'A valid token is required to access this page' });
	}
	return { token };
};

type MissingFieldError = { type: 'MISSING_FIELDS'; fields: string[] };
type NonMatchingPasswordError = { type: 'NON_MATCHING_PASSWORD' };
type UserNotFoundError = { type: 'USER_NOT_FOUND'; email: string };
type ExpiredTokenError = { type: 'EXPIRED_TOKEN' };
type InvalidTokenError = { type: 'INVALID_TOKEN' };
type InvalidPasswordError = { type: 'INVALID_PASSWORD' };

async function validateFormData(
	formData: FormData
): Promise<
	Result<
		{ password: string; token: string; email: string },
		| MissingFieldError
		| NonMatchingPasswordError
		| UserNotFoundError
		| ExpiredTokenError
		| InvalidTokenError
		| InvalidPasswordError
	>
> {
	const missingFields: string[] = [];
	const token = formData.get('token');
	if (typeof token !== 'string') {
		wrapErr({ type: 'INVALID_TOKEN' });
	}
	const password = formData.get('password');
	if (typeof password !== 'string') {
		missingFields.push('password');
	}
	const confirmPassword = formData.get('confirm-password');
	if (typeof confirmPassword !== 'string') {
		missingFields.push('confirm-password');
	}
	const email = formData.get('email');
	if (typeof email !== 'string') {
		missingFields.push('email');
	}
	if (missingFields.length) {
		return wrapErr({ type: 'MISSING_FIELDS', fields: missingFields });
	}
	if (password !== confirmPassword) {
		return wrapErr({ type: 'NON_MATCHING_PASSWORD' });
	}
	if ((password as string).length < 7) {
		return wrapErr({ type: 'INVALID_PASSWORD' });
	}
	const user = await prisma.user.findUnique({ where: { email: email as string } });
	if (user === null) {
		return wrapErr({ type: 'USER_NOT_FOUND', email: email as string });
	}
	if (!user.hashedPasswordResetToken || user.passwordResetExpiry === null) {
		return wrapErr({ type: 'INVALID_TOKEN' });
	}
	if (new Date().getTime() > user.passwordResetExpiry.getTime()) {
		return wrapErr({ type: 'EXPIRED_TOKEN' });
	}
	const isTokenValid = await compare(token as string, user.hashedPasswordResetToken);

	console.log({ dbToken: user.hashedPasswordResetToken, token, compareRes: isTokenValid });
	if (!isTokenValid) {
		return wrapErr({ type: 'INVALID_TOKEN' });
	}
	return wrapOk({ password: password as string, token: token as string, email: email as string });
}

export const actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const validationResult = await validateFormData(formData);
		console.log(validationResult);
		if (!validationResult.ok) {
			return fail(400, validationResult);
		}
		const { password, email } = validationResult.value;
		const hashedPassword = await hash(password, 10);
		const updateResponse = await prisma.user
			.update({
				where: { email: email },
				data: {
					hashedPassword,
					hashedPasswordResetToken: null,
					passwordResetExpiry: null,
					forcePasswordReset: false,
					emailConfirmation: 'Confirmed' // since the user received and replied to a password reset request, we can assume that their email is valid
				}
			})
			.catch(() => null);
		if (updateResponse === null) {
			return error(500, {
				message:
					'Failed to update password. Please try again later or contact an Administrator if the problem persists'
			});
		}
		return wrapOk(null);
	}
} satisfies Actions;
