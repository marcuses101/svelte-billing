import type { Actions, PageServerLoad } from './$types';
import { getSkaterById, prisma } from '$lib/server/db';
import { error, fail } from '@sveltejs/kit';
import { validateSkaterForm } from '../../create/validateSkaterForm';

export const load: PageServerLoad = async ({ params }) => {
	const skater = await getSkaterById(params.id);
	if (!skater) {
		error(404);
	}
	console.log(skater);
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
		await prisma.skater.update({
			where: { id: params.id },
			data: { firstName, lastName, email, skaterTypeCode }
		});

		return { success: true };
	}
} satisfies Actions;
