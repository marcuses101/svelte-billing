import { wrapErr, wrapOk, type Result } from './rustResult';

type ValidationObject = {
	name: string;
	parseAs?: 'string' | 'number' | 'date';
};
type ValidationRecord = Record<string, ValidationObject>;

type Output<V extends ValidationRecord> = {
	[Key in keyof V]: V[Key]['parseAs'] extends 'number'
		? number
		: V[Key]['parseAs'] extends 'date'
			? Date
			: string;
};

type ValidationErrors = {
	message: string;
	missingFields: string[];
	parseErrors: { name: string; errorType: 'parseIntError' | 'parseDateError' }[];
};
export function validateFormData<V extends Record<string, ValidationObject>>(
	formData: FormData,
	validator: V
): Result<Output<V>, ValidationErrors> {
	const validation = Object.entries(validator).reduce(
		(acc, [key, { name: formName, parseAs }]) => {
			const value = formData.get(formName);
			if (typeof value !== 'string') {
				acc.ok = false;
				acc.error.missingFields.push(formName);
				return acc;
			}
			if (parseAs === 'number') {
				const parsedValue = parseInt(value);
				if (Number.isNaN(parsedValue) || !Number.isFinite(parsedValue)) {
					acc.ok = false;
					acc.error.parseErrors.push({ name: formName, errorType: 'parseIntError' });
					return acc;
				}
				acc.value[key] = parsedValue;
				return acc;
			}
			if (parseAs === 'date') {
				const date = new Date(value);
				if (Number.isNaN(date.getTime())) {
					acc.ok = false;
					acc.error.parseErrors.push({ name: formName, errorType: 'parseDateError' });
					return acc;
				}
				acc.value[key] = date;
				return acc;
			}
			acc.value[key] = value;
			return acc;
		},
		{
			ok: true,
			value: {} as Record<string, string | number | Date>,
			error: { missingFields: [], parseErrors: [], message: 'Validation Error' } as ValidationErrors
		}
	);
	if (validation.ok) {
		return wrapOk(validation.value as Output<V>);
	}
	return wrapErr(validation.error);
}
