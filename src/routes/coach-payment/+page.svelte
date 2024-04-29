<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import StyledTable from '$lib/components/StyledTable.svelte';
	import { formatCurrency } from '$lib/formatCurrency.js';

	export let data;

	const options = data.coaches.map(({ id, user: { firstName, lastName } }) => ({
		label: `${firstName} ${lastName}`,
		value: id
	}));
	const dateFormatter = new Intl.DateTimeFormat('en-CA', { dateStyle: 'short' });
	const rows = data.paymentEntries.map((payment) => {
		const amount = formatCurrency(payment.amountInCents, true);
		return { name: payment.name, amount, date: dateFormatter.format(payment.date) };
	});
</script>

<PageHeader title="Coach Payments Recieved" />

<form class="flex flex-col md:flex-row gap-2 mb-8" method="POST">
	<select
		name="coach-id"
		id="coach-id"
		class="select select-bordered w-full flex md:max-w-sm"
		required
	>
		<option disabled selected value={null}>Coach Name</option>
		{#each options as { label, value }}
			<option {value}>{label}</option>
		{/each}
	</select>
	<label for="amount" class="input input-bordered flex items-center gap-2">
		Amount $:
		<input type="number" min="0" step="0.01" name="amount" id="amount" class="grow" required />
	</label>
	<button type="submit" class="btn btn-primary">Add Payment</button>
</form>

<StyledTable>
	<tr slot="head">
		<th>Date</th>
		<th>Name</th>
		<th class="text-right">Amount</th>
	</tr>
	{#each rows as { date, name, amount }}
		<tr>
			<td>{date}</td>
			<td>{name}</td>
			<td class="text-right">{amount}</td>
		</tr>
	{:else}
		<tr>
			<td>No Payments Recorded</td>
		</tr>
	{/each}
</StyledTable>
