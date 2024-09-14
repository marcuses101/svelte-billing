<script>
	import PageHeader from '$lib/components/PageHeader.svelte';
	export let form;
</script>

<PageHeader title="Test Page" />
{#if form?.ok}
	<p>Submitted successfully</p>
{/if}
<form method="POST">
	<button type="submit" class="btn btn-primary">Test Email</button>
</form>
