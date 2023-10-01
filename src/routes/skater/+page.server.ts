import { getSkaters } from '$lib/server/db';

export function load() {
	const skaters = getSkaters();
	return { skaters };
}
