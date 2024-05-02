<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { formatCurrency } from '$lib/formatCurrency';

	export let data;
</script>

<PageHeader title="Ledgers" />

<div class="grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-x-8 gap-y-4">
	{#each Object.entries(data.ledgerSummary) as [key, { ledgerType, positiveTransactionType, debitSumInCents, balanceInCents, creditSumInCents }]}
		<div
			class="stats shadow-lg border"
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
