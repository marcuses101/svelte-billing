import { prisma } from '$lib/server/db';
import type { Actions } from './$types';
import { ACCOUNT_TYPE_CODE } from '$lib/defs';
import { validateCoachForm } from './validateCoachForm';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const coachFormValidationResult = validateCoachForm(data);
		if (!coachFormValidationResult.ok) {
			return coachFormValidationResult.error;
		}
		const { firstName, lastName, email, commissionPercentage, coachRates } =
			coachFormValidationResult.value;

		const coach = await prisma.user.create({
			data: {
				firstName,
				lastName,
				email,
				UserRoles: { create: [{ roleName: 'coach' }] },
				Coach: {
					create: {
                        isHstCharged: 
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
