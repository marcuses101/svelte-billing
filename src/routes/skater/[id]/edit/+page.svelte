<script lang="ts">
	import BackButton from '$lib/components/BackButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import SkaterForm from '../../SkaterForm.svelte';

	export let data;
	const {
		skater: { firstName, lastName, email }
	} = data;
</script>

<PageHeader title="Skater Edit">
	<span slot="title-pre">{`${data.skater.firstName} ${data.skater.lastName} - `}</span>
	<BackButton href={`/skater/${data.skater.id}`}>Back to Info</BackButton>
</PageHeader>
<SkaterForm {firstName} {lastName} {email} />
