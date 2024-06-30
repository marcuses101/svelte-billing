import { env } from '$env/dynamic/private';
import { prisma } from '$lib/server/db';
import type { Actions } from './$types';
import { ACCOUNT_TYPE_CODE } from '$lib/defs';
import { hash } from 'bcrypt';
import { validateCoachForm } from '$lib/validateCoachForm';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const coachFormValidationResult = validateCoachForm(data);
		if (!coachFormValidationResult.ok) {
			return coachFormValidationResult.error;
		}
		const { firstName, lastName, email, commissionPercentage, coachRates, isHstCharged } =
			coachFormValidationResult.value;
		const defaultPassword = env.DEFAULT_PASSWORD;
		if (!defaultPassword) {
			// TODO update this with better password creation
			throw new Error('default password not configured');
		}

		const hashedPassword = await hash(defaultPassword, 10);

		const coach = await prisma.user.create({
			data: {
				firstName,
				lastName,
				email,
				hashedPassword,
				UserRoles: { create: [{ roleName: 'coach' }] },
				Coach: {
					create: {
						isHstCharged,
						commissionPercentage: commissionPercentage,
						CoachRate: { createMany: { data: coachRates } },
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
