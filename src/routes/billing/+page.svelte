<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';

	export let form;
</script>

<PageHeader title="Billing" />
{#if form && form?.ok}
	<p>Invoice data generated</p>
	<div class="rounded-xl p-4 shadow-xl bg-neutral text-neutral-content">
		<pre><code>{JSON.stringify(form.value, null, 2)}</code></pre>
	</div>
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
