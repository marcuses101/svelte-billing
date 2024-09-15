import { config } from '$lib/config';
import { sendEmail } from './emailClient';
import { wrapErr, wrapOk } from '$lib/rustResult';
import { prisma } from '$lib/server/db';
import { format } from 'util';

const COACH_EMAIL_CONFIRMATION_TEMPLATE_BODY = `\
<p>Please click the link below to confirm your email address</p>
<p><a href="%s">Click to confirm</a></p>
`;

const COACH_EMAIL_CONFIRMATION_TEMPLATE_SUBJECT = `\
TLSS Email Confirmation - %s`;

export async function sendCoachEmailConfirmation(myFetch: typeof fetch, coachId: string) {
	const coach = await prisma.coach.findUnique({ where: { id: coachId }, include: { User: true } });
	if (!coach) {
		return wrapErr({ message: `Coach with id ${coachId} not found` });
	}
	if (coach.User.emailConfirmation !== 'Pending') {
		return wrapErr({
			message: `Invalid Email Confirmation status: ${coach?.User.emailConfirmation}`
		});
	}
	const coachEmail = coach.User.email;
	const userId = coach.User.id;
	const coachFullName = `${coach.User.firstName} ${coach.User.lastName}`;

	try {
		await prisma.$transaction(async (tx) => {
			const emailConfirmationToken = await tx.emailConfirmationToken.create({
				data: { userId }
			});
			const link = new URL('/confirm-coach-email', config.SELF_URL);
			link.searchParams.set('user-id', userId);
			link.searchParams.set('token', emailConfirmationToken.token);

			const subject = format(COACH_EMAIL_CONFIRMATION_TEMPLATE_SUBJECT, coachFullName);
			const htmlBody = format(COACH_EMAIL_CONFIRMATION_TEMPLATE_BODY, link.href);
			const emailResponse = await sendEmail({
				fetchFunction: myFetch,
				recipientEmail: coachEmail,
				subject,
				htmlBody
			});
			if (!emailResponse.ok) {
				throw new Error(emailResponse.error.message);
			}
			await tx.coach.update({
				where: { id: coachId },
				data: {
					User: {
						update: {
							data: {
								emailConfirmation: 'Pending',
								confirmationEmailDeliveryStatus: 'Pending',
								confirmationEmailMessageId: emailResponse.value.MessageID
							}
						}
					}
				}
			});
		});
		return wrapOk(null);
	} catch (error) {
		return wrapErr({ message: 'Prisma Transaction failure', error });
	}
}
