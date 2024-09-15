import { prisma } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { sendSkaterInvoice } from '$lib/features/email/sendSkaterInvoice';
import { wrapErr } from '$lib/rustResult';
import { validateUserIsAdmin } from '$lib/validateUserIsAdmin';

export const load: PageServerLoad = async () => {
	const invoices = await prisma.invoice.findMany({
		orderBy: { invoiceDate: 'desc' },
		include: {
			BillingBatch: { select: { humanReadableId: true } },
			Skater: {
				select: {
					firstName: true,
					lastName: true,
					id: true,
					emailConfirmation: true
				}
			}
		}
	});
	return { invoices };
};

export const actions = {
	default: async ({ request, fetch, locals }) => {
		const isAdmin = validateUserIsAdmin(locals);
		if (!isAdmin) {
			return fail(403, { message: 'You are not authorized to perform this action' });
		}
		const formData = await request.formData();
		const invoiceId = formData.get('invoice-id');
		if (typeof invoiceId !== 'string') {
			return fail(400, wrapErr({ message: 'invoiceId is required' }));
		}
		const sendResponse = await sendSkaterInvoice(fetch, invoiceId);
		if (!sendResponse.ok) {
			return fail(500, { message: sendResponse.error.message });
		}
		return sendResponse;
	}
} satisfies Actions;
