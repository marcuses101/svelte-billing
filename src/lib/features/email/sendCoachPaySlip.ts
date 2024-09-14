import { SELF_URL } from '$env/static/private';
import { formatCurrency } from '$lib/formatCurrency';
import { formatDate } from '$lib/formatDate';
import { wrapErr, wrapOk, type Result } from '$lib/rustResult';
import { prisma } from '$lib/server/db';
import { format } from 'util';
import { sendEmail, type SendEmailError } from './emailClient';
import type { CoachPaySlip } from '@prisma/client';

const COACH_PAY_SLIP_EMAIL_TEMPLATE_SUBJECT = `TLSS Pay Slip %s - %s`;
const COACH_PAY_SLIP_EMAIL_TEMPLATE_BODY = `\
<p>
    Hello,
</p>

<p>
    Your balance is currently %s.<br/>
    Click <b><a href="%s">here</a></b> for your detailed bill.
</p>

<p>
    Thanks,<br/>
    TLSS
</p>
`;

export function getcoachpaySlipEmailContent({
	amountDueInCents,
	paySlipDate,
	paySlipId,
	coachFirstName,
	coachLastName
}: {
	amountDueInCents: number;
	paySlipDate: Date;
	paySlipId: string;
	coachId: string;
	coachFirstName: string;
	coachLastName: string;
}) {
	const currentBalance = formatCurrency(amountDueInCents);
	const formattedDate = formatDate(paySlipDate);
	const coachFullName = `${coachFirstName} ${coachLastName}`;
	const subject = format(COACH_PAY_SLIP_EMAIL_TEMPLATE_SUBJECT, formattedDate, coachFullName);
	const link = new URL(`/my-info/pay-slips/${paySlipId}`, SELF_URL);
	const htmlBody = format(COACH_PAY_SLIP_EMAIL_TEMPLATE_BODY, currentBalance, link.href);
	return { subject, htmlBody };
}

export async function sendCoachPaySlip(
	myFetch: typeof fetch,
	paySlipId: string
): Promise<Result<CoachPaySlip, SendEmailError>> {
	const paySlip = await prisma.coachPaySlip.findUnique({
		where: { id: paySlipId },
		include: { Coach: { include: { User: true } } }
	});
	if (!paySlip) {
		return wrapErr({ message: `paySlip with id "${paySlipId} not found` });
	}
	const {
		Coach: {
			User: { firstName: coachFirstName, lastName: coachLastName, email, emailConfirmation },
			id: coachId
		},
		date: paySlipDate,
		amountDueInCents
	} = paySlip;
	if (emailConfirmation != 'Confirmed') {
		return wrapErr({
			message: `Email has not been confirmed, current status: "${emailConfirmation}"`
		});
	}
	const { subject, htmlBody } = getcoachpaySlipEmailContent({
		amountDueInCents,
		paySlipDate,
		paySlipId,
		coachFirstName,
		coachLastName,
		coachId
	});
	const emailRes = await sendEmail({
		fetchFunction: myFetch,
		recipientEmail: email,
		subject,
		htmlBody
	});
	if (!emailRes.ok) {
		return emailRes;
	}
	try {
		const updatedpaySlip = await prisma.coachPaySlip.update({
			where: { id: paySlipId },
			data: { emailMessageId: emailRes.value.MessageID, emailDeliveryStatus: 'Pending' }
		});
		return wrapOk(updatedpaySlip);
	} catch (e) {
		return wrapErr({ message: 'Update paySlip failed', error: e });
	}
}
