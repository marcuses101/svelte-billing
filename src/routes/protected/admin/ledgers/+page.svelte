<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { LEDGER_TYPE } from '$lib/defs.js';
	import { formatCurrency } from '$lib/formatCurrency';
	let { data } = $props();

	const ledgerTypes = Object.values(LEDGER_TYPE);
	const ledgers = Object.entries(data.ledgerSummary).sort((a, b) => {
		const aTypeIndex = ledgerTypes.indexOf(a[1].ledgerType);
		const bTypeIndex = ledgerTypes.indexOf(b[1].ledgerType);
		return aTypeIndex > bTypeIndex ? 1 : -1;
	});
</script>

<PageHeader title="Ledgers" />

<div class="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
	{#each ledgers as [key, { ledgerType, positiveTransactionType, debitSumInCents, balanceInCents, creditSumInCents }]}
		<div
			class="stats min-w-fit shadow-lg border"
			class:border-primary={positiveTransactionType === 'Debit'}
			class:border-secondary={positiveTransactionType === 'Credit'}
		>
			<div class="stat">
				<div
					class="stat-figure"
					class:text-primary={positiveTransactionType === 'Debit'}
					class:text-secondary={positiveTransactionType === 'Credit'}
				>
					{ledgerType}
				</div>
				<div class="stat-title">{key.replace('_', ' ')}</div>
				<div class="stat-value">{formatCurrency(balanceInCents)}</div>
				<div class="stat-desc">Debit: {formatCurrency(debitSumInCents)}</div>
				<div class="stat-desc">Credit: {formatCurrency(creditSumInCents)}</div>
			</div>
		</div>
	{/each}
</div>
