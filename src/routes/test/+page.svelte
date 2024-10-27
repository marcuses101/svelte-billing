<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { toasterState } from '$lib/components/toaster.svelte';
	let input = $state('');
</script>

<PageHeader title="Test Page" />
<form
	onsubmit={(e) => {
		e.preventDefault();
		toasterState.addToast({ message: input, alertType: 'success' });
		input = '';
	}}
>
	<input class="input input-bordered" bind:value={input} />
</form>
