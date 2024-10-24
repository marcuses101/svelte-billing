import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { validateFormData } from '$lib/validateFormData';
import { getSkaterOptions, prisma } from '$lib/server/db';
import { TransactionType } from '@prisma/client';

export const load: PageServerLoad = async ({ locals, params }) => {
	const { id } = params;
	const session = await locals.auth();
	const user = session?.user;
	const coachId = user?.Coach?.id;
	if (!coachId) {
		return error(401, 'Page only available to coaches');
	}
	const skaterInvoiceMiscellaneousItem = await prisma.skaterInvoiceMiscellaneousItem.findUnique({
		where: { id, coachId },
		include: { Skater: { select: { id: true, firstName: true, lastName: true } } }
	});
	if (!skaterInvoiceMiscellaneousItem) {
		return error(404);
	}
	const skaterOptions = await getSkaterOptions();
	return { skaterInvoiceMiscellaneousItem, skaterOptions };
};

export const actions = {
	delete: async ({ locals, params }) => {
		const logger = locals.logger.child({ action: 'delete', miscItemId: params.id });
		const session = await locals.auth();
		const user = session?.user;
		const coachId = user?.Coach?.id;
		if (!coachId) {
			logger.warn('non coach attempting to delete misc item');
			return error(401, 'Page only available to coaches');
		}
		try {
			await prisma.skaterInvoiceMiscellaneousItem.delete({ where: { id: params.id, coachId } });
		} catch (e) {
			console.log(e);
			logger.error(e, 'Prisma Error');
			return error(500, 'Failed to delete item');
		}
		logger.info('skaterInvoiceMiscellaneousItem deleted');
		return redirect(303, '/protected/my-info/additional-charges?deleteId=' + params.id);
	},

	update: async ({ request, locals, params }) => {
		const session = await locals.auth();
		const user = session?.user;
		const coachId = user?.Coach?.id;
		if (!coachId) {
			return error(401, 'Page only available to coaches');
		}
		const formData = await request.formData();
		const logger = locals.logger.child({
			formData: Object.fromEntries(Object.entries(formData))
		});
		const validationResult = validateFormData(formData, {
			skaterId: { name: 'skater-id' },
			amountInCents: { name: 'amount-in-cents', parseAs: 'number' },
			description: { name: 'description' },
			date: { name: 'date', parseAs: 'date' },
			transactionType: { name: 'transaction-type' }
		});
		if (!validationResult.ok) {
			logger.info({ validationResult }, 'validation failed');
			return fail(400, validationResult);
		}
		const miscItem = await prisma.skaterInvoiceMiscellaneousItem
			.update({
				where: { id: params.id, coachId },
				data: {
					coachId,
					skaterId: validationResult.value.skaterId,
					description: validationResult.value.description,
					amountInCents: validationResult.value.amountInCents,
					date: validationResult.value.date.toISOString(),
					transactionType:
						validationResult.value.transactionType === 'credit'
							? TransactionType.Credit
							: TransactionType.Debit
				}
			})
			.catch((e) => {
				return e;
			});

		if (miscItem instanceof Error) {
			logger.error(miscItem, 'prisma error');
			return error(500, 'prisma error');
		}
		logger.info({ miscItem }, 'SkaterInvoiceMicelaneousItem created');
		return redirect(303, '/protected/my-info/additional-charges?updatedId=' + params.id);
	}
} satisfies Actions;
