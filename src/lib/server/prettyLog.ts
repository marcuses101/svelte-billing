import { inspect } from 'node:util';

export function prettyLog(input: Parameters<typeof inspect>[0]) {
	console.log(inspect(input, false, null, true));
}
