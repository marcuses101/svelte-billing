import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import { error, fail } from '@sveltejs/kit';
import { validateSkaterForm } from '../../create/validateSkaterForm';

export const load: PageServerLoad = async ({ params }) => {
	const skater = await prisma.skater.findUnique({
		where: { id: params.id },
		include: { User: { select: { email: true } } }
	});
	if (!skater) {
		error(404);
	}
	return { skater };
};

export const actions = {
	default: async ({ request, params }) => {
		const data = await request.formData();
		console.log(data);
		const validationResult = validateSkaterForm(data);
		if (!validationResult.ok) {
			const { missingFields } = validationResult.error;
			console.log(missingFields);
			return fail(400, { success: false, missingFields });
		}
		const { firstName, lastName, email, skaterTypeCode } = validationResult.value;
		const skater = await prisma.skater.findUnique({ where: { id: params.id } });
		if (!skater) {
			return fail(404, { success: false, message: 'skater not found' });
		}
		const userId = skater.userId;
		await prisma.user.update({
			where: { id: userId },
			data: {
				email,
				Skater: {
					update: {
						where: { id: params.id },
						data: {
							firstName,
							lastName,
							skaterTypeCode
						}
					}
				}
			}
		});

		return { success: true };
	}
} satisfies Actions;
