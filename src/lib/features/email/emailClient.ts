import { config } from '../../config';
import { wrapErr, wrapOk, type Result } from '../../rustResult';

export type PostmarkBody = {
	From: string;
	To: string;
	Subject: string;
	Cc?: string;
	Bcc?: string;
	HtmlBody?: string;
	TextBody?: string;
};

export type PostmarkResponse = {
	To: string;
	SubmittedAt: string;
	MessageID: string;
	ErrorCode: number;
	Message: string;
};

export type SendEmailError = { message: string } | (PostmarkResponse & { message: string });

export async function sendEmail({
	fetchFunction,
	recipientEmail,
	subject,
	textBody,
	htmlBody
}: {
	fetchFunction: typeof fetch;
	recipientEmail: string;
	subject: string;
	textBody?: string;
	htmlBody?: string;
}): Promise<Result<PostmarkResponse, SendEmailError>> {
	console.log({ textBody, htmlBody });
	if (!htmlBody && !textBody) {
		return wrapErr({ message: 'No body has been provided' });
	}
	const url = new URL('/email', config.POSTMARK_BASE_URL);

	const headers = new Headers();
	headers.set('Accept', 'application/json');
	headers.set('Content-Type', 'application/json');
	headers.set('X-Postmark-Server-Token', config.POSTMARK_TOKEN);

	const body: PostmarkBody = {
		From: config.EMAIL_SENDER_ADDRESS,
		To: recipientEmail,
		Subject: subject,
		TextBody: textBody,
		HtmlBody: htmlBody
	};

	const res = await fetchFunction(url, {
		method: 'POST',
		headers,
		body: JSON.stringify(body)
	});

	if (!res.ok) {
		try {
			const errorResponse = (await res.json()) as SendEmailError;
			if ('Message' in errorResponse) {
				errorResponse.message = errorResponse.Message;
			}
			return wrapErr(errorResponse);
		} catch {
			wrapErr({ message: 'Failed to parse json' });
		}
	}
	const json = (await res.json()) as PostmarkResponse;
	return wrapOk(json);
}
