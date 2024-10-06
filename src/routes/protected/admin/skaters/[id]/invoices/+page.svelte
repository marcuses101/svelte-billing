<script>
	import StyledTable from '$lib/components/StyledTable.svelte';
	import { formatCurrency } from '$lib/formatCurrency';

	export let data;
	const {
		skater: { id: skaterId }
	} = data;
	const formatDate = new Intl.DateTimeFormat('en-CA', { dateStyle: 'short' }).format;
</script>

<StyledTable>
	<tr slot="head">
		<th>Date</th>
		<th class="text-right">Invoice Amount</th>
	</tr>
	<tr>
		<td>
			<a class="link link-primary" href={`/protected/admin/skaters/${skaterId}/invoices/current`}>
				Current Period Preview
			</a>
		</td>
	</tr>
	{#each data.invoices as invoice}
		<tr>
			<td>
				<a class="link link-primary" href={`/protected/admin/skaters/${skaterId}/invoices/${invoice.id}`}>
					{formatDate(invoice.invoiceDate)}
				</a>
			</td>
			<td class="text-right">{formatCurrency(invoice.amountDueInCents)}</td>
		</tr>
	{/each}
</StyledTable>
