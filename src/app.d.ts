// See https://kit.svelte.dev/docs/types#app

import type { Coach, User, UserRole } from '@prisma/client';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: (User & { Coach?: Coach | null; UserRoles?: UserRole[] | null }) | null;
		}
		// interface PageData {}
		// interface Platform {}
	}
	// add these lines
	interface ViewTransition {
		updateCallbackDone: Promise<void>;
		ready: Promise<void>;
		finished: Promise<void>;
		skipTransition: () => void;
	}

	interface Document {
		startViewTransition(updateCallback: () => Promise<void>): ViewTransition;
	}
}

export {};
