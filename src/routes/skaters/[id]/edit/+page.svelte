<script lang="ts">
	import BackButton from '$lib/components/BackButton.svelte';
	import CancelButton from '$lib/components/CancelButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import SkaterForm from '../../SkaterForm.svelte';

	export let data;
	const {
		skater: { firstName, lastName, email }
	} = data;
</script>

<PageHeader title="Skater Edit">
	<span slot="title-pre">{`${data.skater.firstName} ${data.skater.lastName} - `}</span>
	<div class="flex gap-1">
		<CancelButton href={`/skaters/${data.skater.id}`} />
		<BackButton href={`/skaters`}>Back to Skaters</BackButton>
	</div>
</PageHeader>
<SkaterForm {firstName} {lastName} {email} />
