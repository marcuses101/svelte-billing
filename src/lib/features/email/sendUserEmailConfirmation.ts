import { config } from '$lib/config';
import { sendEmail } from './emailClient';
import { wrapErr, wrapOk } from '$lib/rustResult';
import { prisma } from '$lib/server/db';
import { format } from 'util';

const USER_EMAIL_CONFIRMATION_TEMPLATE_BODY = `\
<p>Please click the link below to confirm your email address</p>
<p><a href="%s">Click to confirm</a></p>
`;

const USER_EMAIL_CONFIRMATION_TEMPLATE_SUBJECT = `\
TLSS Email Confirmation - %s`;

export async function sendUserEmailConfirmation(myFetch: typeof fetch, userId: string) {
	const user = await prisma.user.findUnique({ where: { id: userId } });

	if (!user) {
		return wrapErr({ message: `User with id ${userId} not found` });
	}
	if (user.emailConfirmation !== 'Pending') {
		return wrapErr({
			message: `Invalid Email Confirmation status: ${user.emailConfirmation}`
		});
	}
	const fullName = `${user.firstName} ${user.lastName}`;

	try {
		await prisma.$transaction(async (tx) => {
			const emailConfirmationToken = await tx.emailConfirmationToken.create({
				data: { userId }
			});
			const link = new URL('/confirm-user-email', config.SELF_URL);
			link.searchParams.set('user-id', userId);
			link.searchParams.set('token', emailConfirmationToken.token);

			const subject = format(USER_EMAIL_CONFIRMATION_TEMPLATE_SUBJECT, fullName);
			const htmlBody = format(USER_EMAIL_CONFIRMATION_TEMPLATE_BODY, link.href);
			const emailResponse = await sendEmail({
				fetchFunction: myFetch,
				recipientEmail: user.email,
				subject,
				htmlBody
			});
			if (!emailResponse.ok) {
				throw new Error(emailResponse.error.message);
			}
			await tx.user.update({
				where: { id: userId },
				data: {
					emailConfirmation: 'Pending',
					confirmationEmailDeliveryStatus: 'Pending',
					confirmationEmailMessageId: emailResponse.value.MessageID
				}
			});
		});
		return wrapOk(null);
	} catch (error) {
		return wrapErr({ message: 'Prisma Transaction failure', error });
	}
}
