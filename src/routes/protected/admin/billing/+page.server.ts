import { wrapErr } from '$lib/rustResult';
import { generateBillingBatch } from '$lib/server/generateBillingBatch';
import { validateUserIsAdmin } from '$lib/validateUserIsAdmin';
import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
	const isAdmin = await validateUserIsAdmin(locals);
	if (!isAdmin) {
		error(403, 'You are not authorized to access this page');
	}
	const baseBillingBatch = await prisma.billingBatch.findMany({
		orderBy: { createdAt: 'desc' },
		include: { Invoices: true, CoachPaySlips: true }
	});
	const billingBatch = baseBillingBatch.map((batch) => {
		const invoicesTotal = batch.Invoices.reduce(
			(acc, invoice) => acc + invoice.amountDueInCents,
			0
		);
		const paySlipTotal = batch.CoachPaySlips.reduce((acc, slip) => acc + slip.amountDueInCents, 0);
		return { ...batch, invoicesTotal, paySlipTotal };
	});
	return { billingBatch };
};

export const actions = {
	generateBills: async ({ locals }) => {
		const logger = locals.logger.child({ action: 'generate bills' });
		try {
			const data = await generateBillingBatch(new Date(), logger);
			return data;
		} catch (e) {
			console.log(e);
			return wrapErr({ message: 'An unknown error occured' });
		}
	}
} satisfies Actions;
