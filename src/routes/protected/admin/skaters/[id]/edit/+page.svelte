<script lang="ts">
	import SkaterForm from '../../SkaterForm.svelte';
	import { inputIsSkaterType } from '$lib/inputIsSkaterType';
	import CancelButton from '$lib/components/CancelButton.svelte';
	import SubmitButton from '$lib/components/SubmitButton.svelte';

	let { data } = $props();
	const {
		skater: { firstName, lastName, skaterTypeCode: maybeTypeCode }
	} = data;
	const isSkaterTypeCode = inputIsSkaterType(maybeTypeCode);
	const skaterTypeCode = isSkaterTypeCode ? maybeTypeCode : undefined;
</script>

<SkaterForm {firstName} {lastName} {skaterTypeCode}>
	{#snippet buttons()}
	
			<CancelButton href={`/skaters/${data.skater.id}`} />
			<SubmitButton />
		
	{/snippet}
</SkaterForm>
