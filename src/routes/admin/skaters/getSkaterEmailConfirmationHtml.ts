import { format } from 'util';

export const SKATER_EMAIL_CONFIRMATION_TEMPLATE = `\
<p>Please click the link below to confirm your email address</p>
<p><a href="%s">Click to confirm</a></p>
`;

export function getSkaterEmailConfirmationHtml(href: string) {
	return format(SKATER_EMAIL_CONFIRMATION_TEMPLATE, href);
}
