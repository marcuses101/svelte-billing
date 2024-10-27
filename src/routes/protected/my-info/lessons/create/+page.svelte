<script lang="ts">
	import BackButton from '$lib/components/BackButton.svelte';
	import LessonForm from '$lib/components/LessonForm.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	let { data } = $props();

	const skaterSelectOptions = data.skaters.map(({ id, firstName, lastName }) => ({
		value: id,
		label: `${firstName} ${lastName}`
	}));
</script>

<section class="prose container max-w-none">
	<PageHeader title="New Lesson">
		<BackButton href="/protected/my-info/lessons">Back</BackButton>
	</PageHeader>
	<LessonForm skaterOptions={skaterSelectOptions} />
</section>
