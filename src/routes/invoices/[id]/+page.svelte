<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { page } from '$app/stores';
	import InvoiceDisplay from '../../skaters/[id]/invoices/current/InvoiceDisplay.svelte';
	import { formatCurrency } from '$lib/formatCurrency';
	import type { ComponentProps } from 'svelte';
	export let data;
	const formatDate = new Intl.DateTimeFormat('en-CA', { dateStyle: 'short' }).format;

	const charges: ComponentProps<InvoiceDisplay>['charges'] = data.invoice.InvoiceLineItems.map(
		({ amountInCents, date, description }) => ({
			formattedDate: formatDate(date),
			chargeAmount: formatCurrency(amountInCents),
			description
		})
	);
</script>

<PageHeader title={`Invoice - ${$page.params.id}`} />

<InvoiceDisplay
	id={data.invoice.id}
	skaterFirstName={data.invoice.Skater.firstName}
	skaterLastName={data.invoice.Skater.lastName}
	invoiceDate={formatDate(data.invoice.invoiceDate)}
	{charges}
	payments={[]}
	previousBillAmount={formatCurrency(data.invoice.previousAmountDueInCents)}
	outstandingBalance={formatCurrency(data.invoice.outstandingBalanceInCents)}
	taxes={[]}
	amountDue={formatCurrency(data.invoice.amountDueInCents)}
	chargesTotal={formatCurrency(data.invoice.chargesTotalInCents)}
/>
