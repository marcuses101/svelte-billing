<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import StyledTable from '$lib/components/StyledTable.svelte';
	import { formatCurrency } from '$lib/formatCurrency';
	import { formatDate } from '$lib/formatDate';

	export let data;
	const coachName = `${data.coach.User.firstName} ${data.coach.User.lastName}`;
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
	{#each rows as { id, date, amount }}
		<tr>
			<td><a class="link" href={`pay-slips/${id}`}>{date}</a></td>
			<td class="text-right">{amount}</td>
		</tr>
	{/each}
</StyledTable>
