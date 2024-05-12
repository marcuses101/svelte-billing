import { getCoachById, prisma } from '$lib/server/db';
import { fail, error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params: { id } }) => {
	const coach = await getCoachById(id);
	if (!coach) {
		error(404, `Coach with id ${id} not found`);
	}
	return { coach };
};

export const actions = {
	default: async ({ request, params }) => {
		const data = await request.formData();
		const id = params.id;
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
		await prisma.user.update({
			where: { id },
			data: {
				firstName,
				lastName,
				email,
				Coach: { update: { hourlyRateInCents } }
			}
		});

		redirect(303, `/coaches/${id}?success=true`);
	}
} satisfies Actions;
