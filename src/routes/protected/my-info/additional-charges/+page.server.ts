import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { validateFormData } from '$lib/validateFormData';
import { getSkaterOptions, prisma } from '$lib/server/db';
import { wrapOk } from '$lib/rustResult';

export const load: PageServerLoad = async ({ locals, cookies }) => {
	const session = await locals.auth();
	const user = session?.user;
	const coachId = user?.Coach?.id;
	if (!coachId) {
		error(401, 'Page only available to coaches');
	}
	const coachPaySlipMiscellaneousItem = await prisma.coachPaySlipMiscellaneousItem.findMany({
		where: { CoachPaySlipLineItem: null, skaterInvoiceMiscellaneousItem: { isNot: null } },
		include: {
			skaterInvoiceMiscellaneousItem: {
				include: { Skater: { select: { firstName: true, lastName: true } } }
			}
		},
		orderBy: { createdAt: 'desc' }
	});
	const skaterOptions = await getSkaterOptions();
	const updatedId = cookies.get('updated-id');
	const createdId = cookies.get('created-id');
	return { coachPaySlipMiscellaneousItem, skaterOptions, updatedId, createdId };
};

export const actions = {
	default: async ({ request, locals, cookies }) => {
		const session = await locals.auth();
		const user = session?.user;
		const coachId = user?.Coach?.id;
		if (!coachId) {
			return error(401, 'Page only available to coaches');
		}
		const formData = await request.formData();
		const logger = locals.logger.child({
			formData: Object.fromEntries(Object.entries(formData)),
			action: 'Add Additional Charge'
		});
		const validationResult = validateFormData(formData, {
			skaterId: { name: 'skater-id' },
			amountInCents: { name: 'amount-in-cents', parseAs: 'number' },
			description: { name: 'description' },
			date: { name: 'date', parseAs: 'date' }
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

		const coachItem = await prisma.coachPaySlipMiscellaneousItem
			.create({
				data: {
					coachId,
					description: validationResult.value.description,
					amountInCents: validationResult.value.amountInCents,
					date,
					transactionType: 'Debit',
					skaterInvoiceMiscellaneousItem: {
						create: {
							skaterId: validationResult.value.skaterId,
							description: validationResult.value.description,
							amountInCents: validationResult.value.amountInCents,
							date,
							transactionType: 'Credit'
						}
					}
				}
			})

			.catch((e) => {
				return e;
			});

		if (coachItem instanceof Error) {
			logger.error(coachItem, 'prisma error');
			return error(500, 'prisma error');
		}
		logger.info({ coachItem }, 'SkaterInvoiceMicelaneousItem created');
		cookies.set('created-id', coachItem.id, {
			path: '/',
			maxAge: 10
		});
		return wrapOk(null);
	}
} satisfies Actions;
