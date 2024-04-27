<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { formatCurrency } from '$lib/formatCurrency.js';
	let selectedSkaterId: null | string = null;
	export let data;
	const options = data.skaters.map(({ id, firstName, lastName }) => ({
		label: `${firstName} ${lastName}`,
		value: id
	}));
	const dateFormatter = new Intl.DateTimeFormat('en-CA', { dateStyle: 'short' });
	const rows = data.paymentEntries.map((payment) => {
		const amount = formatCurrency(payment.amountInCents, true);
		return { name: payment.name, amount, date: dateFormatter.format(payment.date) };
	});
</script>

<PageHeader title="Skater Payments Recieved" />

<form class="flex flex-row items-end gap-2" method="POST">
	<select
		name="skater-id"
		bind:value={selectedSkaterId}
		id="skater-id"
		class="select select-bordered w-full max-w-xs"
		required
	>
		<option disabled selected value={null}>Skater Name</option>
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

<div class="overflow-x-auto">
	<table class="table">
		<!-- head -->
		<thead>
			<tr>
				<th>Date</th>
				<th>Name</th>
				<th>Amount</th>
			</tr>
		</thead>
		<tbody>
			<!-- row 1 -->
			{#each rows as { date, name, amount }}
				<tr>
					<td>{date}</td>
					<td>{name}</td>
					<td>{amount}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
