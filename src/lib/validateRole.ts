import type { Role } from './server/defs';

export function validateRole(locals: App.Locals, role: Role) {
	return Boolean(locals.user?.UserRoles?.some(({ roleName }) => roleName === role));
}
