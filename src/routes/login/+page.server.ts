import { type Actions } from '@sveltejs/kit';
import { signIn } from '../../auth';

export const actions = {
	default: signIn
} satisfies Actions;
