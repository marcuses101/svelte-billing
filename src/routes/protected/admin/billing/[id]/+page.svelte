<script lang="ts">
	import BackButton from '$lib/components/BackButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import StyledTable from '$lib/components/StyledTable.svelte';
	import { formatCurrency } from '$lib/formatCurrency';
	import { formatDate } from '$lib/formatDate';

	let { data } = $props();
</script>

<PageHeader title={`Billing Batch ${formatDate(data.billingBatch.createdAt)}`}>
	<BackButton>Back</BackButton>
</PageHeader>

<div class="prose max-w-none">
	<h3>Invoices</h3>
	<StyledTable>
		{#snippet head()}
				<tr >
				<th>Name</th>
				<th class="text-right">Amount Due</th>
			</tr>
			{/snippet}
		{#each data.billingBatch.Invoices as { id, amountDueInCents, Skater: { firstName, lastName } }}
			<tr>
				<td
					><a class="link link-primary" href={`/protected/admin/skater-invoices/${id}`}
						>{firstName} {lastName}</a
					></td
				>
				<td class="text-right">{formatCurrency(amountDueInCents)}</td>
			</tr>
		{/each}
	</StyledTable>

	<h3>Coach Pay Slips</h3>
	<StyledTable>
		{#snippet head()}
				<tr >
				<th>Name</th>
				<th class="text-right">Amount Owed</th>
			</tr>
			{/snippet}
		{#each data.billingBatch.CoachPaySlips as { id, amountDueInCents, Coach: { User: { firstName, lastName } } }}
			<tr>
				<td
					><a class="link link-primary" href={`/protected/admin/coach-payslips/${id}`}
						>{firstName} {lastName}</a
					></td
				>
				<td class="text-right">{formatCurrency(amountDueInCents)}</td>
			</tr>
		{/each}
	</StyledTable>
</div>
