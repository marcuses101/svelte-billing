<script lang="ts">
	import BackButton from '$lib/components/BackButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import SkaterForm from '../SkaterForm.svelte';
	import type { ActionData } from './$types';
	export let form: ActionData;
	let skaterFullName = form?.skater?.firstName + ' ' + form?.skater?.lastName;
</script>

<section class="max-w-none">
	<PageHeader title="Add a Skater">
		<BackButton href="/skater">Back to Skaters</BackButton>
	</PageHeader>
	{#if form?.success}
		<Toast>New Skater Created - {skaterFullName}</Toast>
	{/if}
	<SkaterForm />
</section>
