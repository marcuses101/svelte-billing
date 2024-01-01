<script lang="ts">
	import { format } from 'date-fns';
	import LessonForm from '../../create/LessonForm.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import BackButton from '$lib/components/BackButton.svelte';
	export let data;
	export let form;

	const skaterOptions = data.skaters.map(({ id, firstName, lastName }) => ({
		value: id,
		label: `${firstName} ${lastName}`
	}));
	const selectedOptions = data.lesson.skaters.map(({ Skater: { id, firstName, lastName } }) => {
		return { value: id, label: `${firstName} ${lastName}` };
	});
	console.log(data.lesson.date);

	const date = format(data.lesson.date, 'yyyy-MM-dd');
	const minutes = data.lesson.lessonTimeInMinutes;
</script>

<PageHeader title="Lessons">
	<span slot="title-post">
		{' - '} <span>Edit </span>
	</span>
	<BackButton href="/lessons">Back to Lessons</BackButton>
</PageHeader>
{#if form?.success}
	<Toast>Lesson Updated</Toast>
{/if}
<LessonForm {skaterOptions} {selectedOptions} {date} {minutes} />
