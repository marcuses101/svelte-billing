<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import BackButton from '$lib/components/BackButton.svelte';
	import LessonForm from '$lib/components/LessonForm.svelte';
	export let data;
	export let form;

	const skaterOptions = data.skaters.map(({ id, firstName, lastName }) => ({
		value: id,
		label: `${firstName} ${lastName}`
	}));
	const selectedOptions = data.lesson.SkaterLessons.map(
		({ Skater: { id, firstName, lastName } }) => {
			return { value: id, label: `${firstName} ${lastName}` };
		}
	);
	const date = data.lesson.date.toISOString().split('T')[0];

	const minutes = data.lesson.lessonTimeInMinutes;
</script>

<PageHeader title="Edit Lesson">
	<BackButton href="/protected/my-info/lessons">Back</BackButton>
</PageHeader>
{#if form?.success}
	<Toast>Lesson Updated</Toast>
{/if}
<LessonForm {skaterOptions} {selectedOptions} {date} {minutes} mode="Edit" />
