<script lang="ts">
	import SkaterForm from '../SkaterForm.svelte';
	export let data;
	const { firstName, lastName, email } = data.skater;
</script>

<SkaterForm
	disabled={true}
	firstName={firstName ?? ''}
	lastName={lastName ?? ''}
	email={email ?? ''}
/>
