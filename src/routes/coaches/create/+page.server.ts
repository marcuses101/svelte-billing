import { fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';
import type { Actions } from './$types';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const firstName = data.get('first-name');
		const lastName = data.get('last-name');
		const email = data.get('email');
		const hourlyRateFormData = data.get('hourly-rate');
		if (!firstName || typeof firstName !== 'string') {
			return fail(400, { firstName, missing: true });
		}
		if (!lastName || typeof lastName !== 'string') {
			return fail(400, { lastName, missing: true });
		}
		if (!email || typeof email !== 'string') {
			return fail(400, { email, missing: true });
		}
		if (!hourlyRateFormData || typeof hourlyRateFormData !== 'string') {
			return fail(400, { hourlyRateFormData, missing: true });
		}
		const hourlyRateInCents = parseInt(hourlyRateFormData);

		const coach = await prisma.user.create({
			data: {
				firstName,
				lastName,
				email,
				roles: { create: [{ roleName: 'coach' }] },
				Coach: { create: { hourlyRateInCents } }
			}
		});
		return { success: true, coach };
	}
} satisfies Actions;
