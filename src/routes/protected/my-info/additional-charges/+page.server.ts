import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { validateFormData } from '$lib/validateFormData';
import { getSkaterOptions, prisma } from '$lib/server/db';
import { TransactionType } from '@prisma/client';
import { wrapOk } from '$lib/rustResult';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth();
	const user = session?.user;
	const coachId = user?.Coach?.id;
	if (!coachId) {
		error(401, 'Page only available to coaches');
	}
	const skaterInvoiceMiscellaneousItems = await prisma.skaterInvoiceMiscellaneousItem.findMany({
		where: { SkaterInvoiceLineItem: null, coachId },
		include: { Skater: { select: { id: true, firstName: true, lastName: true } } },
		orderBy: { createdAt: 'desc' }
	});
	const skaterOptions = await getSkaterOptions();
	return { skaterInvoiceMiscellaneousItems, skaterOptions };
};

export const actions = {
	default: async ({ request, locals }) => {
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
			.create({
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
		return wrapOk(null);
	}
} satisfies Actions;
