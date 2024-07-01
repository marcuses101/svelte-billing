<script lang="ts">
	import CurrencyInput from '$lib/components/CurrencyInput.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import StyledTable from '$lib/components/StyledTable.svelte';
	import { formatCurrency } from '$lib/formatCurrency.js';
	import { formatDate } from '$lib/formatDate.js';

	export let data;
	const options = data.skaterBalances.map(({ fullName, skaterId, balance }) => ({
		label: `${fullName} (Current Balance: ${formatCurrency(balance)})`,
		value: skaterId
	}));
	const rows = data.paymentEntries.map((payment) => {
		const amount = formatCurrency(payment.amountInCents, true);
		return { name: payment.name, amount, date: formatDate(payment.date) };
	});
</script>

<PageHeader title="Skater Payments Recieved" />

<form class="flex flex-col md:flex-row gap-2 mb-8" method="POST">
	<select
		name="skater-id"
		id="skater-id"
		class="select select-bordered w-full flex md:max-w-sm"
		required
	>
		<option disabled selected value={null}>Skater Name</option>
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
			<td>No payments logged</td>
		</tr>
	{/each}
</StyledTable>
