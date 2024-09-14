import { prisma } from '$lib/server/db';
import { validateUserIsAdmin } from '$lib/validateUserIsAdmin';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { wrapErr } from '$lib/rustResult';
import { sendCoachPaySlip } from '$lib/features/email/sendCoachPaySlip';

export const load: PageServerLoad = async () => {
	const paySlips = await prisma.coachPaySlip.findMany({
		orderBy: { date: 'desc' },
		include: {
			CoachPaySlipLineItems: true,
			Coach: {
				select: {
					id: true,
					User: {
						select: {
							firstName: true,
							lastName: true,
							emailConfirmation: true
						}
					}
				}
			}
		}
	});
	return { paySlips };
};

export const actions = {
	default: async ({ request, fetch, locals }) => {
		const isAdmin = validateUserIsAdmin(locals);
		if (!isAdmin) {
			return fail(403, { message: 'You are not authorized to perform this action' });
		}
		const formData = await request.formData();
		const paySlipId = formData.get('payslip-id');
		if (typeof paySlipId !== 'string') {
			return fail(400, wrapErr({ message: 'paySlipId is required' }));
		}
		const sendResponse = await sendCoachPaySlip(fetch, paySlipId);
		if (!sendResponse.ok) {
			return fail(500, sendResponse);
		}
		return sendResponse;
	}
} satisfies Actions;
