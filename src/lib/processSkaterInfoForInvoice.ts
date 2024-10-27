import { calculateLesson } from '$lib/calculateLessonCost';
import { HST_PERCENTAGE } from '$lib/shared';
import { TransactionType, Prisma } from '@prisma/client';
import { formatSkaterLineItemDescription } from './formatSkaterLineItemDescription';
import { getSkatersWithUninvoicedLessons } from './getSkatersWithUninvoicedLessons';

export function processSkaterInfoForInvoice(
	skaterWithLessons: Awaited<ReturnType<typeof getSkatersWithUninvoicedLessons>>[number]
) {
	const lastInvoice = skaterWithLessons.Invoices[0];
	const lineItemsData: Omit<Prisma.SkaterInvoiceLineItemCreateManyInput, 'invoiceId'>[] =
		skaterWithLessons.SkaterLessons.map(({ Lesson }) => {
			const {
				id: lessonId,
				date: lessonDate,
				lessonTimeInMinutes,
				_count: { SkaterLessons: numberOfSkaters },
				Coach: {
					User: { firstName: coachFirstName, lastName: coachLastName }
				}
			} = Lesson;
			const { skatersWithCost } = calculateLesson(Lesson);
			const currentSkaterCost = skatersWithCost.find(
				(entry) => entry.skaterId === skaterWithLessons.id
			);
			if (!currentSkaterCost) {
				throw new Error(`Skater with id ${skaterWithLessons.id} not found for lesson ${Lesson.id}`);
			}
			const { amountInCents } = currentSkaterCost;

			const description = formatSkaterLineItemDescription(
				numberOfSkaters,
				lessonTimeInMinutes,
				`${coachFirstName} ${coachLastName}`
			);

			return {
				skaterLessonSkaterId: skaterWithLessons.id,
				skaterLessonLessonId: lessonId,
				amountInCents,
				date: lessonDate,
				description,
				transactionType: TransactionType.Credit
			};
		});

	skaterWithLessons.AdditionalCharges.forEach(
		({ amountInCents, transactionType, coachPaySlipMiscellaneousItem, description, date, id }) => {
			const coachFirstName = coachPaySlipMiscellaneousItem?.Coach.User.firstName;
			const coachLastName = coachPaySlipMiscellaneousItem?.Coach.User.lastName;
			const coachName =
				coachFirstName && coachLastName ? `${coachFirstName} ${coachLastName}` : 'Unknown';
			const fullDescription = coachFirstName ? `${description} (${coachName})` : description;
			lineItemsData.push({
				amountInCents,
				description: fullDescription,
				transactionType,
				date,
				skaterInvoiceMiscellaneousItemId: id
			});
		}
	);

	const chargesTotalInCents = lineItemsData.reduce(
		(acc, { amountInCents, transactionType }) =>
			transactionType === 'Credit' ? acc + amountInCents : acc - amountInCents,
		0
	);
	const hstAmountInCents = Math.round(chargesTotalInCents * (HST_PERCENTAGE / 100));

	const paymentsTotal = skaterWithLessons.Account.AccountTransaction.reduce(
		(acc, { amountInCents }) => acc + amountInCents,
		0
	);

	const previousAmountDueInCents = lastInvoice?.amountDueInCents ?? 0;
	const outstandingBalanceInCents = previousAmountDueInCents - paymentsTotal;
	const amountDueInCents = outstandingBalanceInCents + chargesTotalInCents + hstAmountInCents;

	return {
		skaterId: skaterWithLessons.id,
		lineItemsData,
		chargesTotalInCents,
		hstAmountInCents,
		paymentsTotal,
		previousAmountDueInCents,
		outstandingBalanceInCents,
		amountDueInCents,
		payments: skaterWithLessons.Account.AccountTransaction
	};
}
