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
	code = 'Invalid email or password';
}

export const { signIn, signOut, handle } = SvelteKitAuth(async () => {
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
					console.log({ password, hashed: user });

					const isValidPassword = await compare(password, user.hashedPassword);
					if (!isValidPassword) {
						throw new InvalidLoginError('invalid password');
					}

					console.log('Loggin in %s %s', user.firstName, user.lastName);

					return { email: user.email, id: user.id, name: `${user.firstName} ${user.lastName}` };
				}
			})
		],
		secret: config.AUTH_SECRET,
		trustHost: true
	};

	return authOptions;
});
