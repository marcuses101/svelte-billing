<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import StyledTable from '$lib/components/StyledTable.svelte';
	import { formatCurrency } from '$lib/formatCurrency';
	export let data;
</script>

<PageHeader title="Invoices" />

<StyledTable>
	<tr slot="head">
		<th>Skater Name</th>
		<th class="text-right">Invoice Amount</th>
		<th>Invoice Link</th>
	</tr>
	{#each data.invoices as { id: invoiceId, Skater: { id: skaterId, lastName, firstName }, amountDueInCents }}
		<tr>
			<td>
				<a class="link link-primary" href={`/skaters/${skaterId}`}>
					{`${firstName} ${lastName}`}</a
				></td
			>
			<td class="text-right">{formatCurrency(amountDueInCents)}</td>
			<td>
				<a class="link link-primary" href={`/invoices/${invoiceId}`}>Invoice</a>
			</td>
		</tr>
	{/each}
</StyledTable>
