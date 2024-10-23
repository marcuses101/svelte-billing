import { describe, it, expect } from 'vitest';
import { validateFormData } from './validateFormData'; // Replace with the actual path

describe('validateFormData', () => {
	it('should return valid string and number fields', () => {
		const formData = new FormData();
		formData.set('name', 'John');
		formData.set('age', '25');

		const result = validateFormData(formData, {
			name: { name: 'name', parseAs: 'string' },
			age: { name: 'age', parseAs: 'number' }
		});

		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.value.name).toBe('John'); // string value
			expect(result.value.age).toBe(25); // number value
		}
	});

	it('should return an error if a field is missing', () => {
		const formData = new FormData();
		formData.set('name', 'John');

		const result = validateFormData(formData, {
			name: { name: 'name', parseAs: 'string' },
			age: { name: 'age', parseAs: 'number' }
		});

		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(result.error.missingFields).toContain('age');
			expect(result.error.missingFields.length).toBe(1);
		}
	});

	it('should return an error if a number cannot be parsed', () => {
		const formData = new FormData();
		formData.set('name', 'John');
		formData.set('age', 'notANumber');

		const result = validateFormData(formData, {
			name: { name: 'name', parseAs: 'string' },
			age: { name: 'age', parseAs: 'number' }
		});

		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(result.error.parseErrors).toEqual([{ name: 'age', errorType: 'parseIntError' }]);
		}
	});

	it('should handle multiple errors (missing and parse)', () => {
		const formData = new FormData();
		formData.set('name', 'John');
		formData.set('height', 'notANumber');

		const result = validateFormData(formData, {
			name: { name: 'name', parseAs: 'string' },
			age: { name: 'age', parseAs: 'number' },
			height: { name: 'height', parseAs: 'number' }
		});

		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(result.error.missingFields).toContain('age');
			expect(result.error.parseErrors).toContainEqual({
				name: 'height',
				errorType: 'parseIntError'
			});
		}
	});
});
