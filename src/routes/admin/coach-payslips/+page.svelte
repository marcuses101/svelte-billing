<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import StyledTable from '$lib/components/StyledTable.svelte';
	import { formatCurrency } from '$lib/formatCurrency';
	import { formatDate } from '$lib/formatDate.js';

	export let data;
	const rows = data.paySlips.map((slip) => {
		const coachId = slip.Coach.id;
		const date = formatDate(slip.date);
		const { firstName, lastName } = slip.Coach.User;
		const name = `${firstName} ${lastName}`;

		return {
			id: slip.id,
			coachId,
			name,
			date,
			amountDue: formatCurrency(slip.amountDueInCents)
		};
	});
</script>

<PageHeader title="Pay Slips" />

<StyledTable>
	<tr slot="head">
		<th> Date</th>
		<th>Coach Name</th>
		<th class="text-right">Pay Slip Total</th>
		<th>Details</th>
	</tr>
	{#each rows as { id, name, amountDue, coachId, date }}
		<tr>
			<td>{date}</td>
			<td>
				<a class="link link-primary" href={`/coaches/${coachId}`}>
					{name}
				</a>
			</td>
			<td class="text-right">{amountDue}</td>
			<td>
				<a class="link link-primary" href={`/pay-slips/${id}`}>Pay Slip</a>
			</td>
		</tr>
	{/each}
</StyledTable>
