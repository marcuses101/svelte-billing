<script lang="ts">
	import AddButton from '$lib/components/AddButton.svelte';
	import LessonDisplay from './LessonDisplay.svelte';

	export let data;

	const dateFormat = new Intl.DateTimeFormat('en-CA', {
		weekday: 'long',
		day: 'numeric',
		month: 'short',
		year: 'numeric',
		timeZone: 'UTC'
	}).format;

	type FormattedLesson = {
		id: string;
		skaters: string[];
		lessonTimeInMinutes: number;
		formattedDate: string;
	};

	const lessonsMap = data.lessons.reduce((acc, entry) => {
		const dateKey = new Date(entry.date).toISOString().split('T')[0];
		if (!dateKey) return acc;
		const formattedDate = dateFormat(entry.date);
		const skaters = entry.SkaterLessons.map((skater) => {
			const fullName = `${skater.Skater.firstName} ${skater.Skater.lastName}`;
			return fullName;
		});
		const currentEntry = {
			id: entry.id,
			skaters,
			lessonTimeInMinutes: entry.lessonTimeInMinutes,
			formattedDate
		};
		if (!acc.has(dateKey)) {
			acc.set(dateKey, [currentEntry]);
			return acc;
		}
		const array = acc.get(dateKey)!;
		array.push(currentEntry);
		return acc;
	}, new Map<string, FormattedLesson[]>());
	const groupedLessons = Array.from(lessonsMap.entries()).sort(
		(a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime()
	);
</script>

<section class="prose max-w-none">
	<AddButton href="/my-info/lessons/create">Add Lesson</AddButton>
	{#each groupedLessons as [date, lessons]}
		<h3 class="text-lg">{dateFormat(new Date(date))}</h3>
		<div class="grid gap-4">
			{#each lessons as { skaters, lessonTimeInMinutes, id }}
				<LessonDisplay {skaters} {lessonTimeInMinutes} {id} />
			{/each}
		</div>
	{/each}
</section>
