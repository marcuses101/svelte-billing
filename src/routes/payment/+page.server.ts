import { getSkaters } from '$lib/server/db';

export async function load() {
	const skaters = await getSkaters();
	return { skaters };
}
