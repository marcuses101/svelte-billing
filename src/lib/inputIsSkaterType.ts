import { SKATER_TYPE, type SkaterType } from './defs';

export function inputIsSkaterType(input: string): input is SkaterType {
	return Object.values(SKATER_TYPE).includes(input as SkaterType);
}
