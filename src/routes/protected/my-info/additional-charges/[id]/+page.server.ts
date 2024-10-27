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
	const coachPaySlipMiscellaneousItem = await prisma.coachPaySlipMiscellaneousItem.findUnique({
		where: { id, coachId, skaterInvoiceMiscellaneousItem: { isNot: null } },
		include: {
			skaterInvoiceMiscellaneousItem: {
				include: {
					Skater: { select: { id: true, firstName: true, lastName: true } }
				}
			}
		}
	});
	if (!coachPaySlipMiscellaneousItem) {
		return error(404);
	}
	const skaterOptions = await getSkaterOptions();
	return { coachPaySlipMiscellaneousItem, skaterOptions };
};

export const actions = {
	delete: async ({ locals, params }) => {
		const logger = locals.logger.child({
			action: 'Delete Additional Charge',
			miscItemId: params.id
		});
		const session = await locals.auth();
		const user = session?.user;
		const coachId = user?.Coach?.id;
		if (!coachId) {
			logger.warn('non coach attempting to delete misc item');
			return error(401, 'Page only available to coaches');
		}
		try {
			await prisma.coachPaySlipMiscellaneousItem.delete({ where: { id: params.id, coachId } });
		} catch (e) {
			console.log(e);
			logger.error(e, 'Prisma Error');
			return error(500, 'Failed to delete item');
		}
		logger.info('skaterInvoiceMiscellaneousItem deleted');
		return redirect(303, '/protected/my-info/additional-charges');
	},

	update: async ({ request, locals, params, cookies }) => {
		const session = await locals.auth();
		const user = session?.user;
		const coachId = user?.Coach?.id;
		if (!coachId) {
			return error(401, 'Page only available to coaches');
		}
		const formData = await request.formData();
		const logger = locals.logger.child({
			formData: Object.fromEntries(Object.entries(formData)),
			action: 'Edit Additional Charge'
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

		const skater = await prisma.skater.findUnique({
			where: { id: validationResult.value.skaterId }
		});
		if (!skater) {
			logger.error(`could not find skater with id "${validationResult.value.skaterId}"`);
			return error(404, `could not find skater with id "${validationResult.value.skaterId}"`);
		}
		const date = validationResult.value.date.toISOString();

		const miscItem = await prisma.coachPaySlipMiscellaneousItem
			.update({
				where: { id: params.id, coachId },
				data: {
					coachId,
					description: validationResult.value.description,
					amountInCents: validationResult.value.amountInCents,
					date,
					transactionType: TransactionType.Debit,
					skaterInvoiceMiscellaneousItem: {
						upsert: {
							where: { coachPaySlipMiscellaneousItemId: params.id },
							update: {
								skaterId: validationResult.value.skaterId,
								description: validationResult.value.description,
								amountInCents: validationResult.value.amountInCents,
								date,
								transactionType: TransactionType.Credit
							},
							create: {
								skaterId: validationResult.value.skaterId,
								description: validationResult.value.description,
								amountInCents: validationResult.value.amountInCents,
								date,
								transactionType: TransactionType.Credit
							}
						}
					}
				}
			})
			.catch((e: Error) => {
				return e;
			});

		if (miscItem instanceof Error) {
			logger.error(miscItem, 'prisma error');
			return error(500, 'prisma error');
		}
		logger.info({ miscItem }, 'SkaterInvoiceMicelaneousItem created');

		cookies.set('updated-id', params.id, {
			path: '/',
			maxAge: 10
		});
		return redirect(303, '/protected/my-info/additional-charges');
	}
} satisfies Actions;
