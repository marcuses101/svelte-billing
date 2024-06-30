export function formatSkaterLineItemDescription(
	numberOfSkaters: number,
	lessonTimeInMinutes: number,
	coachName: string
): string {
	if (numberOfSkaters === 1) {
		return `${lessonTimeInMinutes} minute private lesson (${coachName})`;
	}
	return `${lessonTimeInMinutes} minute group (${numberOfSkaters} skaters) lesson (${coachName})`;
}
