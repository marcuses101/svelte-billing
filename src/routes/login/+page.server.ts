import { type Actions } from '@sveltejs/kit';
import { signIn } from '../../auth';

export const actions = {
	default: (event) => {
		return signIn(event);
	}
} satisfies Actions;
