<script lang="ts">
	import SkaterForm from '../../SkaterForm.svelte';

	export let data;
	const {
		skater: { firstName, lastName, email }
	} = data;
</script>

<SkaterForm {firstName} {lastName} {email} />
