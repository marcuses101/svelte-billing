<script lang="ts">
	import BackButton from '$lib/components/BackButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import StyledTable from '$lib/components/StyledTable.svelte';
	import { formatCurrency } from '$lib/formatCurrency';
	import { formatDate } from '$lib/formatDate';

	export let data;
</script>

<PageHeader title={`Billing Batch ${formatDate(data.billingBatch.createdOn)}`}>
	<BackButton>Back</BackButton>
</PageHeader>

<div class="prose max-w-none">
	<h3>Invoices</h3>
	<StyledTable>
		<tr slot="head">
			<th>Name</th>
			<th class="text-right">Amount Due</th>
		</tr>
		{#each data.billingBatch.Invoices as { id, amountDueInCents, Skater: { firstName, lastName } }}
			<tr>
				<td
					><a class="link link-primary" href={`/admin/skater-invoices/${id}`}
						>{firstName} {lastName}</a
					></td
				>
				<td class="text-right">{formatCurrency(amountDueInCents)}</td>
			</tr>
		{/each}
	</StyledTable>

	<h3>Coach Pay Slips</h3>
	<StyledTable>
		<tr slot="head">
			<th>Name</th>
			<th class="text-right">Amount Owed</th>
		</tr>
		{#each data.billingBatch.CoachPaySlips as { id, amountDueInCents, Coach: { User: { firstName, lastName } } }}
			<tr>
				<td
					><a class="link link-primary" href={`/admin/coach-payslips/${id}`}
						>{firstName} {lastName}</a
					></td
				>
				<td class="text-right">{formatCurrency(amountDueInCents)}</td>
			</tr>
		{/each}
	</StyledTable>
</div>
