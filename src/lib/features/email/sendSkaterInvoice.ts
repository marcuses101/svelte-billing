import { SELF_URL } from '$env/static/private';
import { formatCurrency } from '$lib/formatCurrency';
import { formatDate } from '$lib/formatDate';
import { wrapErr, wrapOk, type Result } from '$lib/rustResult';
import { prisma } from '$lib/server/db';
import { format } from 'util';
import { sendEmail, type SendEmailError } from './emailClient';
import type { Invoice } from '@prisma/client';

const SKATER_INVOICE_EMAIL_TEMPLATE_SUBJECT = `TLSS Invoice %s - %s`;
const SKATER_INVOICE_EMAIL_TEMPLATE_BODY = `\
<p>
    Hello,
</p>

<p>
    Your balance is currently %s.<br/>
    Click <b><a href="%s">here</a></b> for your detailed bill.
</p>

<p>
    Thanks,<br/>
    TLSS Coaches
</p>
`;

export function getSkaterInvoiceEmailContent({
	amountDueInCents,
	invoiceDate,
	invoiceId,
	skaterFirstName,
	skaterLastName,
	skaterId
}: {
	amountDueInCents: number;
	invoiceDate: Date;
	invoiceId: string;
	skaterId: string;
	skaterFirstName: string;
	skaterLastName: string;
}) {
	const currentBalance = formatCurrency(amountDueInCents);
	const formattedDate = formatDate(invoiceDate);
	const skaterFullName = `${skaterFirstName} ${skaterLastName}`;
	const subject = format(SKATER_INVOICE_EMAIL_TEMPLATE_SUBJECT, formattedDate, skaterFullName);
	const link = new URL('/invoice', SELF_URL);
	link.searchParams.set('skater-id', skaterId);
	link.searchParams.set('invoice-id', invoiceId);
	const htmlBody = format(SKATER_INVOICE_EMAIL_TEMPLATE_BODY, currentBalance, link.href);
	return { subject, htmlBody };
}

export async function sendSkaterInvoice(
	myFetch: typeof fetch,
	invoiceId: string
): Promise<Result<Invoice, SendEmailError>> {
	const invoice = await prisma.invoice.findUnique({
		where: { id: invoiceId },
		include: { Skater: true }
	});
	if (!invoice) {
		return wrapErr({ message: `Invoice with id "${invoiceId} not found` });
	}
	const {
		Skater: {
			firstName: skaterFirstName,
			lastName: skaterLastName,
			emailConfirmation,
			email,
			id: skaterId
		},
		invoiceDate,
		amountDueInCents
	} = invoice;
	if (emailConfirmation != 'Confirmed') {
		return wrapErr({
			message: `Email has not been confirmed, current status: "${emailConfirmation}"`
		});
	}
	const { subject, htmlBody } = getSkaterInvoiceEmailContent({
		amountDueInCents,
		invoiceDate,
		invoiceId,
		skaterFirstName,
		skaterLastName,
		skaterId
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
		const updatedInvoice = await prisma.invoice.update({
			where: { id: invoiceId },
			data: { emailMessageId: emailRes.value.MessageID, emailDeliveryStatus: 'Pending' }
		});
		return wrapOk(updatedInvoice);
	} catch (e) {
		return wrapErr({ message: 'Update Invoice failed', error: e });
	}
}
