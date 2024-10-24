<script lang="ts">
	import type { ActionData } from './$types';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import BackButton from '$lib/components/BackButton.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import CoachForm from '$lib/components/CoachForm.svelte';
	interface Props {
		form: ActionData;
	}

	let { form }: Props = $props();
	let coachFullName = form?.coach?.firstName + ' ' + form?.coach?.lastName;
</script>

<section class="prose container max-w-none">
	<PageHeader title="Add New Coach">
		<BackButton href="/coaches">Back to Coaches</BackButton>
	</PageHeader>
	{#if form?.coach}
		<Toast>New Coach Created - {coachFullName}</Toast>
	{/if}
	<CoachForm />
</section>
