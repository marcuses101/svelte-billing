import type { Actions, PageServerLoad } from './$types';
import { getSkaterById, prisma } from '$lib/server/db';
import { error, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const skater = await getSkaterById(params.id);
	if (!skater) {
		error(404);
	}
	return { skater };
};

export const actions = {
	default: async ({ request, params }) => {
		const data = await request.formData();
		const firstName = data.get('first-name') as string;
		const lastName = data.get('last-name') as string;
		const email = data.get('email') as string;
		if (!firstName) {
			return fail(400, { firstName, missing: true });
		}
		if (!lastName) {
			return fail(400, { lastName, missing: true });
		}
		if (!email) {
			return fail(400, { email, missing: true });
		}
		await prisma.skater.update({
			where: { id: params.id },
			data: { firstName, lastName, email }
		});

		return { success: true };
	}
} satisfies Actions;
