import { expect, test } from 'vitest';
import { getSkaterEmailConfirmationHtml } from './getSkaterEmailConfirmationHtml';

test('should produce the expected html string', () => {
	const expected = `\
<p>Please click the link below to confirm your email address</p>
<p><a href="example@gmail.com">Click to confirm</a></p>
`;
	expect(getSkaterEmailConfirmationHtml('example@gmail.com')).toBe(expected);
});
