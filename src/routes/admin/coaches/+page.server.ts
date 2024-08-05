import { prisma } from '$lib/server/db';
import { error, fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { sendEmail } from '$lib/emailClient';
import { wrapErr, wrapOk } from '$lib/rustResult';
import { config } from '$lib/config';

export async function load() {
	const data = await prisma.user.findMany({
		include: { Coach: true },
		orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
		where: { Coach: { isNot: null } }
	});

	const coaches = data.map(({ firstName, lastName, email, Coach, emailConfirmation }) => ({
		firstName,
		lastName,
		id: Coach?.id!,
		email,
		emailConfirmation
	}));
	return { coaches };
}

async function sendCoachEmailConfirmation(myFetch: typeof fetch, coachId: string) {
	const coach = await prisma.coach.findUnique({ where: { id: coachId }, include: { User: true } });
	if (!coach) {
		return wrapErr({ message: `Coach with id ${coachId} not found` });
	}
	if (coach.User.emailConfirmation !== 'NotSent') {
		return wrapErr({
			message: `Invalid Email Confirmation status: ${coach?.User.emailConfirmation}`
		});
	}
	const coachEmail = coach.User.email;

	try {
		await prisma.$transaction(async (tx) => {
			const emailConfirmationToken = await tx.emailConfirmationToken.create({
				data: { coachId: coachId }
			});
			const link = new URL('/confirm-coach-email', config.SELF_URL);
			link.searchParams.set('coach-id', coachId);
			link.searchParams.set('token', emailConfirmationToken.token);

			const htmlContent = `\
<p>Please click the link below to confirm your email address</p>
<p><a href=${link.href}>Click to confirm</a></p>
`;
			const emailResponse = await sendEmail(
				myFetch,
				'info@tlss.ca',
				// TODO change back to once postmark approval coachEmail,
				`TLSS Email Confirmation - ${coach.User.firstName} ${coach.User.lastName}`,
				undefined,
				htmlContent
			);
			console.log(emailResponse);
			if (!emailResponse.ok) {
				if ('message' in emailResponse.error) {
					throw new Error(emailResponse.error.message);
				}
				throw new Error(emailResponse.error.Message);
			}
			await tx.coach.update({
				where: { id: coachId },
				data: { User: { update: { data: { emailConfirmation: 'Pending' } } } }
			});
		});
		return wrapOk(null);
	} catch {
		return wrapErr({ message: 'Prisma Transaction failure' });
	}
}

export const actions = {
	'send-confirmation': async ({ request, fetch }) => {
		const formData = await request.formData();
		const coachId = formData.get('coach-id');
		if (typeof coachId !== 'string') {
			return fail(400, { message: 'coachId is required' });
		}
		const sendResponse = await sendCoachEmailConfirmation(fetch, coachId);
		return sendResponse;
	}
} satisfies Actions;
