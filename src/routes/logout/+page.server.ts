import { signOut } from '../../auth';
import type { Actions } from './$types';
export const actions: Actions = {
	default: (...args) => {
		console.log(args);
		return signOut(...args);
	}
};
