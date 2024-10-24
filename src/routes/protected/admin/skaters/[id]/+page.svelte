<script lang="ts">
	import EditButton from '$lib/components/EditButton.svelte';
	import { inputIsSkaterType } from '$lib/inputIsSkaterType';
	import SkaterForm from '../SkaterForm.svelte';
	let { data } = $props();
	const { firstName, lastName, skaterTypeCode: maybeSkaterCode } = data.skater;
	const isSkaterCode = inputIsSkaterType(maybeSkaterCode);
	const skaterTypeCode = isSkaterCode ? maybeSkaterCode : undefined;
</script>

<SkaterForm disabled={true} firstName={firstName ?? ''} lastName={lastName ?? ''} {skaterTypeCode}>
	{#snippet buttons()}
	
			<div></div>
			<EditButton href={`/protected/admin/skaters/${data.skater.id}/edit`} />
		
	{/snippet}
</SkaterForm>
