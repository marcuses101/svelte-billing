<script lang="ts">
	import JsonDisplay from '$lib/components/JsonDisplay.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';

	export let form;
</script>

<PageHeader title="Billing" />
{#if form && form?.ok}
	<p>Invoice data generated</p>
	<JsonDisplay data={form.value} />
{/if}
{#if form && !form.ok}
	<p>Failed to generate Invoices Data</p>
	{#if form.error.message}
		<p class="text-error">{form.error.message}</p>
	{/if}
{/if}
<form method="POST" action="?/generateBills">
	<button class="btn btn-primary" type="submit">Generate Bills</button>
</form>
