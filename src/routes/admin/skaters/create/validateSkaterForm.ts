import { wrapErr, wrapOk, type Result } from '$lib/rustResult';
import type { SkaterType } from '$lib/defs';
import { inputIsSkaterType } from '$lib/inputIsSkaterType';

export function validateSkaterForm(
	data: FormData
): Result<
	{ firstName: string; lastName: string; email: string; skaterTypeCode: SkaterType },
	{ missingFields: string[] }
> {
	const missingFields: string[] = [];
	const firstName = data.get('first-name');
	if (!firstName || typeof firstName !== 'string') {
		missingFields.push('first-name');
	}
	const lastName = data.get('last-name');
	if (!lastName || typeof lastName !== 'string') {
		missingFields.push('last-name');
	}
	const email = data.get('email');
	if (!email || typeof email !== 'string') {
		missingFields.push('email');
	}
	const skaterTypeCode = data.get('skater-type-code');
	if (
		!skaterTypeCode ||
		typeof skaterTypeCode !== 'string' ||
		!inputIsSkaterType(skaterTypeCode as string)
	) {
		missingFields.push('skater-type-code');
	}

	if (missingFields.length > 0) {
		return wrapErr({ missingFields });
	}
	return wrapOk({
		firstName: firstName as string,
		lastName: lastName as string,
		email: email as string,
		skaterTypeCode: skaterTypeCode as SkaterType
	});
}
