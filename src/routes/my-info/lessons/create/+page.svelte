<script lang="ts">
	import BackButton from '$lib/components/BackButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import LessonForm from './LessonForm.svelte';
	import { format } from 'date-fns';
	export let data;
	export let form;

	const defaultDate = format(new Date(), 'yyyy-MM-dd');

	const skaterSelectOptions = data.skaters.map(({ id, firstName, lastName }) => ({
		value: id,
		label: `${firstName} ${lastName}`
	}));
</script>

<section class="prose container max-w-none">
	<PageHeader title="New Lesson">
		<BackButton href="my-info/lessons">Back to Lessons</BackButton>
	</PageHeader>
	{#if form?.success && form?.lessonTimeInMinutes}
		<Toast>
			{form?.lessonTimeInMinutes} minute lesson logged
		</Toast>
	{/if}
	<LessonForm skaterOptions={skaterSelectOptions} date={defaultDate} />
</section>
