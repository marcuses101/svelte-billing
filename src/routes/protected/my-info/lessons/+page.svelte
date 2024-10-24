<script lang="ts">
	import AddButton from '$lib/components/AddButton.svelte';
	import PencilIcon from '$lib/icons/PencilIcon.svelte';
	import LessonDisplay from './LessonDisplay.svelte';

	let { data } = $props();

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
		createdAt: Date;
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
			formattedDate,
			createdAt: entry.createdAt
		};
		if (!acc.has(dateKey)) {
			acc.set(dateKey, [currentEntry]);
			return acc;
		}
		const array = acc.get(dateKey)!;
		array.push(currentEntry);
		return acc;
	}, new Map<string, FormattedLesson[]>());

	const groupedLessons = [...lessonsMap.entries()]
		.sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
		.map(([dateString, lessons]) => {
			return {
				dayFormatted: dateFormat(new Date(dateString)),
				lessons: lessons.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
			};
		});
	const formatMinutes = new Intl.NumberFormat('en-CA', { style: 'unit', unit: 'minute' }).format;
</script>

<section class="prose max-w-none">
	<AddButton href="/protected/my-info/lessons/create">Add Lesson</AddButton>
	{#each groupedLessons as { dayFormatted, lessons }}
		<h3 class="text-lg">{dayFormatted}</h3>
		<div class="grid gap-2">
			{#each lessons as { skaters, lessonTimeInMinutes, id }}
				<div class="collapse collapse-arrow border-primary border">
					<input type="radio" name="my-accordion-2" />
					<div class="collapse-title text-xl font-medium">
						{formatMinutes(lessonTimeInMinutes)} - {`${skaters.length} skater(s)`}
					</div>
					<div class="collapse-content">
						<div class="flex flex-row">
							<div class="flex flex-1 flex-row flex-wrap gap-1">
								{#each skaters as skater}
									<div class="badge badge-sm badge-outline">{skater}</div>
								{/each}
							</div>
							<a
								class="btn btn-sm btn-secondary btn-circle"
								href={`/protected/my-info/lessons/${id}/edit`}><PencilIcon /></a
							>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/each}
</section>
