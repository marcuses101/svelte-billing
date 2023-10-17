// See https://kit.svelte.dev/docs/types#app

import type { Coach, User } from '@prisma/client';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: (User & { Coach?: Coach | null }) | null;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
