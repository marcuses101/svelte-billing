import { compare } from 'bcrypt';
import {
	SvelteKitAuth,
	type DefaultSession,
	type SvelteKitAuthConfig,
	CredentialsSignin
} from '@auth/sveltekit';
import Credentials from '@auth/sveltekit/providers/credentials';
import { prisma } from '$lib/server/db';
import { config } from '$lib/config';
import { redirect } from '@sveltejs/kit';
import { INVALID_EMAIL_OR_PASSWORD_CODE } from '$lib/defs';

function getUserByEmail(email: string) {
	return prisma.user.findUnique({
		where: { email },
		include: { Coach: true, UserRoles: true }
	});
}

export type User = Exclude<Awaited<ReturnType<typeof getUserByEmail>>, null>;

const PASSWORD_RESET_CODE = 'password reset required';

declare module '@auth/sveltekit' {
	interface Session {
		user: User & DefaultSession['user'];
	}
}

export class InvalidLoginError extends CredentialsSignin {
	code = INVALID_EMAIL_OR_PASSWORD_CODE;
}

export class PasswordResetRequiredError extends CredentialsSignin {
	code = PASSWORD_RESET_CODE;
}

const { signIn, signOut, handle } = SvelteKitAuth(async () => {
	const authOptions: SvelteKitAuthConfig = {
		callbacks: {
			async session({ session, token }) {
				const userId = token.sub;
				if (!userId) {
					throw new Error('no user id found');
				}

				const user = await prisma.user.findUnique({
					where: { id: token.sub },
					include: { Coach: true, UserRoles: true }
				});
				if (!user) {
					throw new Error(`User with id ${userId} not found`);
				}
				session.user = { ...session.user, ...user };
				return session;
			}
		},
		providers: [
			Credentials({
				credentials: {
					email: { label: 'Email' },
					password: { label: 'Password', type: 'password', minLength: 7 }
				},
				authorize: async (credentials) => {
					const { email, password } = credentials;
					if (typeof email !== 'string') {
						throw new InvalidLoginError('email string not provided');
					}
					if (typeof password !== 'string') {
						throw new InvalidLoginError('password string not provided');
					}
					const user = await prisma.user.findUnique({
						where: { email }
					});

					if (!user) {
						throw new InvalidLoginError(`User with email "${email}" not found in the database`);
					}
					if (!user.hashedPassword || user.forcePasswordReset) {
						throw new PasswordResetRequiredError(`User with email ${email} must reset password`);
					}

					const isValidPassword = await compare(password, user.hashedPassword);
					if (!isValidPassword) {
						throw new InvalidLoginError('invalid password');
					}

					console.log('Logging in %s %s', user.firstName, user.lastName);

					return { email: user.email, id: user.id, name: `${user.firstName} ${user.lastName}` };
				}
			})
		],
		pages: {
			signIn: '/login'
		},
		secret: config.AUTH_SECRET,
		trustHost: true
	};

	return authOptions;
});

const customHandle: typeof handle = (event) => {
	const url = event.event.url;
	const isPasswordResetRequired =
		url.pathname === '/auth/signin' && url.searchParams.get('code') === PASSWORD_RESET_CODE;
	if (isPasswordResetRequired) {
		console.log('Password Reset Required');
		return redirect(303, '/password-reset-request?required=true');
	}
	return handle(event);
};

export { signIn, signOut, customHandle as handle };
