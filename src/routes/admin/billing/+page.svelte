<script lang="ts">
	import JsonDisplay from '$lib/components/JsonDisplay.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import StyledTable from '$lib/components/StyledTable.svelte';
	import { formatCurrency } from '$lib/formatCurrency';
	import { formatDate } from '$lib/formatDate';

	export let form;
	export let data;
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
<form method="POST" action="?/generateBills" class="mb-4">
	<button class="btn btn-primary" type="submit">Generate Bills</button>
</form>

<StyledTable>
	<tr slot="head">
		<th>Batch Id</th>
		<th>Date</th>
		<th>Invoices Total</th>
		<th>Coach Pay Total</th>
		<th>Commission</th>
	</tr>
	{#each data.billingBatch as { id, createdOn, paySlipTotal, invoicesTotal }}
		<tr>
			<td><a class="link link-primary" href={`/admin/billing/${id}`}>{id}</a></td>
			<td>{formatDate(createdOn)}</td>
			<td>{formatCurrency(invoicesTotal)}</td>
			<td>{formatCurrency(paySlipTotal)}</td>
			<td>TBD</td>
		</tr>
	{/each}
</StyledTable>
