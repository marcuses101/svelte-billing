import { prisma } from '$lib/server/db';
import { validateUserIsAdmin } from '$lib/validateUserIsAdmin';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, params }) => {
	const isAdmin = await validateUserIsAdmin(locals);
	if (!isAdmin) {
		return error(403, 'You are not authorized to view this page');
	}
	const billingBatch = await prisma.billingBatch.findUnique({
		where: { id: params.id },
		include: {
			Invoices: { include: { Skater: { select: { firstName: true, lastName: true } } } },
			CoachPaySlips: {
				include: { Coach: { include: { User: { select: { firstName: true, lastName: true } } } } }
			}
		}
	});
	if (!billingBatch) {
		return error(404);
	}
	return { billingBatch };
};
