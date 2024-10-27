import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
	const session = (await locals.auth())!;
	const user = session?.user;
	const toastCookieContents = cookies.get('toast-message');
	if (!toastCookieContents) {
		return { session, user };
	}
	try {
		const toastMessage = JSON.parse(toastCookieContents);
		const toast = toastMessage
			? { alertType: toastMessage.alertType, message: toastMessage.message }
			: undefined;
		return { session, user, toast };
	} catch {
		return { session, user };
	}
};
