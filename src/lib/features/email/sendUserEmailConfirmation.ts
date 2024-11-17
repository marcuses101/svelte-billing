import { config } from '$lib/config';
import { sendEmail } from './emailClient';
import { wrapErr, wrapOk } from '$lib/rustResult';
import { prisma } from '$lib/server/db';
import { format } from 'util';
import type { Logger } from 'pino';

const USER_EMAIL_CONFIRMATION_TEMPLATE_BODY = `\
<p>Please click the link below to confirm your email address</p>
<p><a href="%s">Click to confirm</a></p>
`;

const USER_EMAIL_CONFIRMATION_TEMPLATE_SUBJECT = `\
TLSS Email Confirmation - %s`;

export async function sendUserEmailConfirmation(
	myFetch: typeof fetch,
	userId: string,
	logger: Logger
) {
	logger.debug('fetching user');
	const user = await prisma.user.findUnique({ where: { id: userId } });

	if (!user) {
		logger.error({ invalidUserId: userId }, 'Invalid user attempting to send confirmation email');
		return wrapErr({ message: `User with id ${userId} not found` });
	}
	logger.debug('user found');
	if (user.emailConfirmation !== 'Pending') {
		logger.warn(`expected emailConfirmation === "Pending", received "${user.emailConfirmation}"`);
		return wrapErr({
			message: `Invalid Email Confirmation status: ${user.emailConfirmation}`
		});
	}
	logger.debug('emailConfirmation valid');
	const fullName = `${user.firstName} ${user.lastName}`;

	logger.debug('start prisma transaction');
	try {
		await prisma.$transaction(async (tx) => {
			logger.debug('create token start');
			const emailConfirmationToken = await tx.emailConfirmationToken.create({
				data: { userId }
			});
			logger.debug('create token complete');
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
				logger.warn(emailResponse);
				throw new Error(emailResponse.error.message);
			}
			logger.info({ emailResponse });
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
		logger.error(error, 'prisma transaction error');
		return wrapErr({ message: 'Prisma Transaction failure', error });
	}
}
