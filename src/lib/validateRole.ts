import type { User } from '../auth';
import type { Role } from './defs';

export function validateRole(user: User, role: Role) {
	return Boolean(user?.UserRoles?.some(({ roleName }) => roleName === role));
}
