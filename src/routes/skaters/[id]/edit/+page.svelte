<script lang="ts">
	import SkaterForm from '../../SkaterForm.svelte';
	import { inputIsSkaterType } from '$lib/inputIsSkaterType';

	export let data;
	const {
		skater: { firstName, lastName, email, skaterTypeCode: maybeTypeCode }
	} = data;
	const isSkaterTypeCode = inputIsSkaterType(maybeTypeCode);
	const skaterTypeCode = isSkaterTypeCode ? maybeTypeCode : undefined;
</script>

<SkaterForm {firstName} {lastName} {email} {skaterTypeCode} />
