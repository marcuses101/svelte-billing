import { prisma } from '$lib/server/db';
import { error, fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { ROLES } from '$lib/defs';
import { sendUserEmailConfirmation } from '$lib/features/email/sendUserEmailConfirmation';

export async function load() {
	const users = await prisma.user.findMany({
		orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
		include: { UserRoles: true }
	});
	const { clients, admins, coaches } = users.reduce(
		(acc, current) => {
			const userRoleNames = current.UserRoles.map((role) => role.roleName);
			if (userRoleNames.includes(ROLES.CLIENT)) {
				acc.clients.push(current);
			}
			if (userRoleNames.includes(ROLES.COACH)) {
				acc.coaches.push(current);
			}
			if (userRoleNames.includes(ROLES.ADMIN)) {
				acc.admins.push(current);
			}
			return acc;
		},
		{
			clients: [] as typeof users,
			coaches: [] as typeof users,
			admins: [] as typeof users
		}
	);
	return { clients, admins, coaches };
}

export const actions = {
	'send-confirmation': async ({ request, fetch }) => {
		const formData = await request.formData();
		const userId = formData.get('user-id');
		if (typeof userId !== 'string') {
			return fail(400, { message: 'user-id is required' });
		}
		const sendResponse = await sendUserEmailConfirmation(fetch, userId);
		if (!sendResponse.ok) {
			error(500, sendResponse.error);
		}
		return sendResponse;
	}
} satisfies Actions;
