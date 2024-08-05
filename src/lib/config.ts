import { SELF_URL, EMAIL_SENDER_ADDRESS, POSTMARK_TOKEN, AUTH_SECRET } from '$env/static/private';

function getConfig() {
	const config = {
		SELF_URL,
		EMAIL_SENDER_ADDRESS,
		POSTMARK_TOKEN,
		AUTH_SECRET,
		POSTMARK_BASE_URL: 'https://api.postmarkapp.com/'
	} as const;
	const missingConfigs = Object.entries(config).filter((entry) => typeof entry[1] === 'undefined');
	if (missingConfigs.length > 0) {
		const missingKeys = missingConfigs.map((entry) => entry[0]).join(', ');
		throw new Error(`Missing configurations: ${missingKeys}`);
	}
	return config as { readonly [P in keyof typeof config]: NonNullable<(typeof config)[P]> };
}

export const config = getConfig();
