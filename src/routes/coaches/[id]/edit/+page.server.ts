import { getCoachById, prisma } from '$lib/server/db';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { validateCoachForm } from '$lib/validateCoachForm';

export const load: PageServerLoad = async ({ params }) => {
	const coach = await getCoachById(params.id);
	if (!coach) {
		error(404, `Coach with id ${params.id} not found`);
	}
	return { coach };
};

export const actions = {
	default: async ({ request, params }) => {
		const data = await request.formData();
		const id = params.id;
		const coachFormValidationResult = validateCoachForm(data);
		console.log({ coachFormValidationResult });

		if (!coachFormValidationResult.ok) {
			return coachFormValidationResult.error;
		}
		const { firstName, lastName, email, commissionPercentage, coachRates } =
			coachFormValidationResult.value;
		await prisma.$transaction(async (tx) => {
			await tx.coach.update({
				where: { id },
				data: {
					commissionPercentage,
					User: {
						update: {
							firstName,
							lastName,
							email
						}
					}
				}
			});
			for (const rate of coachRates) {
				await tx.coachRate.update({
					where: { coachId_skaterTypeCode: { coachId: id, skaterTypeCode: rate.skaterTypeCode } },
					data: { hourlyRateInCents: rate.hourlyRateInCents }
				});
			}
		});
		redirect(303, `/coaches/${id}?success=true`);
	}
} satisfies Actions;
