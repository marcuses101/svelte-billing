<script lang="ts">
	import StyledTable from '$lib/components/StyledTable.svelte';
	import { formatCurrency } from '$lib/formatCurrency';
	import { formatDate } from '$lib/formatDate';

	export let data;
	const rows = data.coach.CoachPaySlips.map((entry) => {
		const date = formatDate(entry.date);
		const amount = formatCurrency(entry.amountDueInCents);
		return { date, amount, id: entry.id };
	});
</script>

<StyledTable>
	<tr slot="head">
		<th>Date</th>
		<th class="text-right">Amount</th>
	</tr>
	<tr>
		<td
			><a class="link link-primary no-underline font-bold" href={`pay-slips/current`}
				>Upcoming Pay Slip Preview</a
			></td
		>
		<td class="text-right">{formatCurrency(data.currentPeriodAmount)}</td>
	</tr>
	{#each rows as { id, date, amount }}
		<tr>
			<td
				><a class="link link-primary no-underline font-bold" href={`pay-slips/${id}`}>{date}</a></td
			>
			<td class="text-right">{amount}</td>
		</tr>
	{/each}
</StyledTable>
