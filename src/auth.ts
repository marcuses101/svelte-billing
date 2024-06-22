import { env } from '$env/dynamic/private';
import { SvelteKitAuth, type DefaultSession, type SvelteKitAuthConfig } from '@auth/sveltekit';
import Credentials from '@auth/sveltekit/providers/credentials';
// Your own logic for dealing with plaintext password strings; be careful!
// import { saltAndHashPassword } from '@/utils/password';
import { prisma } from '$lib/server/db';

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

export const { signIn, signOut, handle } = SvelteKitAuth(async () => {
	const authOptions: SvelteKitAuthConfig = {
		callbacks: {
			async session({ session, token }) {
				console.log({ session, token });
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
				// You can specify which fields should be submitted, by adding keys to the `credentials` object.
				// e.g. domain, username, password, 2FA token, etc.
				credentials: {
					email: {}
					// password: {}
				},
				authorize: async (credentials) => {
					console.log(credentials);
					// logic to salt and hash password
					//		const pwHash = saltAndHashPassword(credentials.password);

					// logic to verify if user exists
					//		user = await getUserFromDb(credentials.email, pwHash);
					const { email } = credentials;
					if (typeof email !== 'string') {
						throw new Error('invalid email');
					}
					const user = await getUserByEmail(email);

					if (!user) {
						throw new Error('User not found.');
					}

					console.log('Loggin in %s %s', user.firstName, user.lastName);
					// return json object with the user data

					return { email: user.email, id: user.id, name: `${user.firstName} ${user.lastName}` };
				}
			})
		],
		secret: env.AUTH_SECRET,
		trustHost: true
	};
	return authOptions;
});
