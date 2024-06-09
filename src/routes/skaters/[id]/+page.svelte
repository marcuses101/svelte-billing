<script lang="ts">
	import { inputIsSkaterType } from '$lib/inputIsSkaterType';
	import SkaterForm from '../SkaterForm.svelte';
	export let data;
	const { firstName, lastName, email, skaterTypeCode: maybeSkaterCode } = data.skater;
	const isSkaterCode = inputIsSkaterType(maybeSkaterCode);
	const skaterTypeCode = isSkaterCode ? maybeSkaterCode : undefined;
</script>

<SkaterForm
	disabled={true}
	firstName={firstName ?? ''}
	lastName={lastName ?? ''}
	email={email ?? ''}
	{skaterTypeCode}
/>
