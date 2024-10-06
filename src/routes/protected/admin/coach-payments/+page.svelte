<script lang="ts">
	import CurrencyInput from '$lib/components/CurrencyInput.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import StyledTable from '$lib/components/StyledTable.svelte';
	import { formatCurrency } from '$lib/formatCurrency.js';

	export let data;

	const options = data.coachBalances.map(({ fullName, balance, coachId }) => ({
		label: `${fullName} (Amount Owed: ${formatCurrency(balance)})`,
		value: coachId
	}));
	const dateFormatter = new Intl.DateTimeFormat('en-CA', { dateStyle: 'short' });
	const rows = data.paymentEntries.map((payment) => {
		const amount = formatCurrency(payment.amountInCents, true);
		return { name: payment.name, amount, date: dateFormatter.format(payment.date) };
	});
</script>

<PageHeader title="Coach Payments" />

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
	<CurrencyInput name="amount-in-cents" />
	<button type="submit" class="btn btn-primary">Add Payment</button>
</form>

<StyledTable>
	<tr slot="head">
		<th>Date</th>
		<th>Name</th>
		<th class="text-right">Amount Payed</th>
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
