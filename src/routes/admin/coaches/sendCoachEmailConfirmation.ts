import { config } from '$lib/config';
import { sendEmail } from '$lib/emailClient';
import { wrapErr, wrapOk } from '$lib/rustResult';
import { prisma } from '$lib/server/db';
import { format } from 'util';

const COACH_EMAIL_CONFIRMATION_TEMPLATE = `\
<p>Please click the link below to confirm your email address</p>
<p><a href="%s">Click to confirm</a></p>
`;

function getCoachEmailConfirmationHtml(href: string) {
	return format(COACH_EMAIL_CONFIRMATION_TEMPLATE, href);
}

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

	try {
		await prisma.$transaction(async (tx) => {
			const emailConfirmationToken = await tx.emailConfirmationToken.create({
				data: { userId }
			});
			const link = new URL('/confirm-coach-email', config.SELF_URL);
			link.searchParams.set('user-id', userId);
			link.searchParams.set('token', emailConfirmationToken.token);

			const htmlContent = getCoachEmailConfirmationHtml(link.href);
			const emailResponse = await sendEmail(
				myFetch,
				coachEmail,
				`TLSS Email Confirmation - ${coach.User.firstName} ${coach.User.lastName}`,
				undefined,
				htmlContent
			);
			if (!emailResponse.ok) {
				if ('message' in emailResponse.error) {
					throw new Error(emailResponse.error.message);
				}
				throw new Error(emailResponse.error.Message);
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
	} catch {
		return wrapErr({ message: 'Prisma Transaction failure' });
	}
}
