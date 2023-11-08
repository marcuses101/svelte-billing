<script lang="ts">
	import SkaterLessonDisplay from '../SkaterLessonDisplay.svelte';

	export let data;
	const { lessons } = data;

	const dateFormat = new Intl.DateTimeFormat('en-CA', {
		weekday: 'long',
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	}).format;
	const currencyFormatter = new Intl.NumberFormat('en-CA', {
		style: 'currency',
		currency: 'CAD'
	});

	const lessonsMap = lessons.reduce(
		(acc, entry) => {
			const dateKey = new Date(entry.date).toISOString().split('T')[0];
			if (!dateKey) return acc;
			const formattedDate = dateFormat(entry.date);
			const currentEntry = {
				id: entry.id,
				date: entry.date,
				type: entry.numberOfSkaters === 1 ? ('private' as const) : ('group' as const),
				lessonTimeInMinutes: entry.lessonTimeInMinutes,
				lessonCharge: currencyFormatter.format(entry.chargeInCents / 100),
				formattedDate,
				coachName: entry.coachName
			};
			if (!acc.has(dateKey)) {
				acc.set(dateKey, [currentEntry]);
				return acc;
			}
			const array = acc.get(dateKey)!;
			array.push(currentEntry);
			return acc;
		},
		new Map<
			string,
			{
				id: string;
				type: 'private' | 'group';
				formattedDate: string;
				lessonTimeInMinutes: number;
				date: Date;
				lessonCharge: string;
				coachName: string;
			}[]
		>()
	);

	const groupedLessons = Array.from(lessonsMap.entries()).sort((a, b) => {
		const aTime = a[1][0]?.date.getTime();
		const bTime = b[1][0]?.date.getTime();
		if (!aTime || !bTime) return 0;
		return aTime - bTime;
	});
</script>

<section class="grid gap-6">
	{#each groupedLessons as [date, lessons]}
		<h3 class="text-xl">{dateFormat(new Date(date))}</h3>
		<div class="grid gap-4">
			{#each lessons as { lessonTimeInMinutes, type, coachName, lessonCharge }}
				<SkaterLessonDisplay {lessonTimeInMinutes} {type} {coachName} {lessonCharge} />
			{/each}
		</div>
	{:else}
		<h3 class="text-xl">No Lessons logged</h3>
	{/each}
</section>
