<script lang="ts">
	import BackButton from '$lib/components/BackButton.svelte';
	import LessonForm from '$lib/components/LessonForm.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Toast from '$lib/components/Toast.svelte';
	let { data, form } = $props();

	const skaterSelectOptions = data.skaters.map(({ id, firstName, lastName }) => ({
		value: id,
		label: `${firstName} ${lastName}`
	}));
</script>

<section class="prose container max-w-none">
	<PageHeader title="New Lesson">
		<BackButton href="/protected/my-info/lessons">Back</BackButton>
	</PageHeader>
	{#if form?.success && form?.lessonTimeInMinutes}
		<Toast>
			{form?.lessonTimeInMinutes} minute lesson logged
		</Toast>
	{/if}
	{#if form?.success === false}
		<Toast alertType="error">Submission failed</Toast>
	{/if}
	<LessonForm skaterOptions={skaterSelectOptions} />
</section>
