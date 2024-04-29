<script>
	import PageHeader from '$lib/components/PageHeader.svelte';
	import StyledTable from '$lib/components/StyledTable.svelte';
	import { formatCurrency } from '$lib/formatCurrency';
	export let data;
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
		</StyledTable>
	</div>
</div>
