import { config } from '$lib/config';
import { sendEmail } from '$lib/features/email/emailClient';
import { wrapErr, wrapOk } from '$lib/rustResult';
import { prisma } from '$lib/server/db';
import { getSkaterEmailConfirmationHtml } from './getSkaterEmailConfirmationHtml';

export async function sendSkaterEmailConfirmation(myFetch: typeof fetch, skaterId: string) {
	const skater = await prisma.skater.findUnique({
		where: { id: skaterId }
	});
	if (!skater) {
		return wrapErr({ message: `skater with id ${skaterId} not found` });
	}
	if (
		skater.emailConfirmation !== 'Pending' &&
		skater.confirmationEmailDeliveryStatus === 'NotSent'
	) {
		return wrapErr({
			message: `Invalid Email Confirmation status: ${skater.emailConfirmation}`
		});
	}
	const skaterEmail = skater.email;

	try {
		await prisma.$transaction(async (tx) => {
			const emailConfirmationToken = await tx.emailConfirmationToken.create({
				data: { skaterId: skaterId }
			});
			const link = new URL('/confirm-skater-email', config.SELF_URL);
			link.searchParams.set('skater-id', skaterId);
			link.searchParams.set('token', emailConfirmationToken.token);
			const htmlBody = getSkaterEmailConfirmationHtml(link.href);

			const emailResponse = await sendEmail({
				fetchFunction: myFetch,
				recipientEmail: skaterEmail,
				subject: `TLSS Email Confirmation - ${skater.firstName} ${skater.lastName}`,
				htmlBody: htmlBody
			});
			if (!emailResponse.ok) {
				if ('message' in emailResponse.error) {
					throw new Error(emailResponse.error.message);
				}
				throw new Error(emailResponse.error.Message);
			}
			await tx.skater.update({
				where: { id: skaterId },
				data: {
					emailConfirmation: 'Pending',
					confirmationEmailDeliveryStatus: 'Pending',
					confirmationEmailMessageId: emailResponse.value.MessageID
				}
			});
		});
		return wrapOk(null);
	} catch {
		return wrapErr({ message: 'Prisma Transaction failure' });
	}
}
