import { fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';
import type { Actions } from './$types';
import { ACCOUNT_TYPE_CODE } from '$lib/server/defs';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const firstName = data.get('first-name');
		if (!firstName || typeof firstName !== 'string') {
			return fail(400, { firstName, missing: true });
		}
		const lastName = data.get('last-name');
		if (!lastName || typeof lastName !== 'string') {
			return fail(400, { lastName, missing: true });
		}
		const email = data.get('email');
		if (!email || typeof email !== 'string') {
			return fail(400, { email, missing: true });
		}

		const commissionPercentage = data.get('commission-percentage');
		if (!commissionPercentage || typeof commissionPercentage !== 'string') {
			return fail(400, { commissionPercentage, missing: true });
		}

		const hourlyRateFormData = data.get('hourly-rate');
		if (!hourlyRateFormData || typeof hourlyRateFormData !== 'string') {
			return fail(400, { hourlyRateFormData, missing: true });
		}
		const hourlyRateInCents = parseInt(hourlyRateFormData);

		const coach = await prisma.user.create({
			data: {
				firstName,
				lastName,
				email,
				UserRoles: { create: [{ roleName: 'coach' }] },
				Coach: {
					create: {
						commissionPercentage: parseFloat(commissionPercentage),
						hourlyRateInCents,
						Account: {
							create: {
								accountTypeCode: ACCOUNT_TYPE_CODE.COACH,
								name: `${firstName} ${lastName} Coach Account`
							}
						}
					}
				}
			}
		});
		return { success: true, coach };
	}
} satisfies Actions;
