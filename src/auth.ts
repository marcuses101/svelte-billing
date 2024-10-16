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
import { INVALID_EMAIL_OR_PASSWORD_CODE, LOGIN_PATHNAME, PASSWORD_RESET_CODE } from '$lib/defs';
import { logger } from '$lib/server/logger';

function getUserByEmail(email: string) {
	return prisma.user.findUnique({
		where: { email },
		include: { Coach: true, UserRoles: true }
	});
}

export type User = Exclude<Awaited<ReturnType<typeof getUserByEmail>>, null>;

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

const { signIn, signOut, handle } = SvelteKitAuth(async ({ locals }) => {
	const authOptions: SvelteKitAuthConfig = {
		events: {
			signOut: (info) => {
				const logoutLogger = locals.logger.child({ action: 'logout' });
				if ('token' in info && info.token !== null) {
					const user = info.token.email ?? 'Unknown';
					logoutLogger.info(`${user} logged out`);
				}
			}
		},
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
		debug: false,
		providers: [
			Credentials({
				credentials: {
					email: { label: 'Email' },
					password: { label: 'Password', type: 'password', minLength: 7 }
				},
				authorize: async (credentials) => {
					const loginLogger = locals.logger.child({ action: 'login' });
					const { email, password } = credentials;
					if (typeof email !== 'string') {
						const loginError = new InvalidLoginError('email string not provided');
						loginLogger.error(loginError);
						throw loginError;
					}
					if (typeof password !== 'string') {
						const loginError = new InvalidLoginError('password string not provided');
						loginLogger.error(loginError);
						throw loginError;
					}
					const user = await prisma.user.findUnique({
						where: { email }
					});

					if (!user) {
						const loginError = new InvalidLoginError(
							`User with email "${email}" not found in the database`
						);
						loginLogger.info(loginError);
						throw loginError;
					}
					if (!user.hashedPassword || user.forcePasswordReset) {
						const passwordResetError = new PasswordResetRequiredError(
							`User with email ${email} must reset password`
						);
						loginLogger.info(passwordResetError);
						throw passwordResetError;
					}

					const isValidPassword = await compare(password, user.hashedPassword);
					if (!isValidPassword) {
						const loginError = new InvalidLoginError('invalid password');
						loginLogger.info({ email }, 'invalid password');
						throw loginError;
					}
					loginLogger.info(`user ${user.email} logged in`);
					return { email: user.email, id: user.id, name: `${user.firstName} ${user.lastName}` };
				}
			})
		],
		pages: {
			signIn: LOGIN_PATHNAME
		},
		secret: config.AUTH_SECRET,
		trustHost: true
	};

	return authOptions;
});

export { signIn, signOut, handle };
