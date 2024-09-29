import { config } from '$lib/config';
import { sendEmail } from './emailClient';
import { format } from 'util';

const PASSWORD_RESET_TEMPLATE_BODY = `\
<p>You have requested a password reset. Please click the link below to initiate the password reset process</p>
<p><a href="%s">Reset Password</a></p>
`;

const PASSWORD_RESET_TEMPLATE_SUBJECT = `TLSS Password Reset Request - %s`;

export async function sendPasswordResetEmail(myFetch: typeof fetch, email: string, token: string) {
	const subject = format(PASSWORD_RESET_TEMPLATE_SUBJECT, new Date().toLocaleDateString());
	const link = new URL('/password-reset', config.SELF_URL);
	link.searchParams.set('token', token);
	const body = format(PASSWORD_RESET_TEMPLATE_BODY, link.toString());
	return sendEmail({
		subject,
		htmlBody: body,
		fetchFunction: myFetch,
		recipientEmail: email
	});
}
