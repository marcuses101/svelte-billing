<script>
	import PageHeader from '$lib/components/PageHeader.svelte';
	import StyledTable from '$lib/components/StyledTable.svelte';
	import { formatCurrency } from '$lib/formatCurrency';
	export let data;
	const skaterTotal = data.skaterBalances.reduce((acc, { balance }) => (acc += balance), 0);
	const coachTotal = data.coachBalances.reduce((acc, { balance }) => (acc += balance), 0);
</script>

<PageHeader title="Overview" />

<div class="prose max-w-none">
	<h3>Skater Info</h3>
	<StyledTable>
		<tr slot="head">
			<th>Name</th>
			<th class="text-right">Account Balance</th>
		</tr>
		{#each data.skaterBalances as { fullName, balance }}
			<tr>
				<td>{fullName}</td>
				<td class="text-right">{formatCurrency(balance)}</td>
			</tr>
		{/each}
		<tr class="font-bold">
			<td>Total</td>
			<td class="text-right">{formatCurrency(skaterTotal)}</td>
		</tr>
	</StyledTable>
	<h3>Coach Info</h3>
	<div class="overflow-x-auto card shadow-xl rounded-xl">
		<StyledTable>
			<tr slot="head">
				<th>Name</th>
				<th class="text-right">Account Balance</th>
			</tr>
			{#each data.coachBalances as { fullName, balance }}
				<tr>
					<td>{fullName}</td>
					<td class="text-right">{formatCurrency(balance)}</td>
				</tr>
			{/each}

			<tr class="font-bold">
				<td>Total</td>
				<td class="text-right">{formatCurrency(coachTotal)}</td>
			</tr>
		</StyledTable>
	</div>
</div>
