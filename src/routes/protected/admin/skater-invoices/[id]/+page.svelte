<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { page } from '$app/stores';
	import InvoiceDisplay from '$lib/components/InvoiceDisplay.svelte';
	import { formatCurrency } from '$lib/formatCurrency';
	import { formatDate } from '$lib/formatDate';
	import type { ComponentProps } from 'svelte';
	let { data } = $props();

	const charges: ComponentProps<typeof InvoiceDisplay>['charges'] =
		data.invoice.InvoiceLineItems.map(({ amountInCents, date, description }) => ({
			formattedDate: formatDate(date),
			chargeAmount: formatCurrency(amountInCents),
			description
		}));
	const payments: ComponentProps<typeof InvoiceDisplay>['payments'] =
		data.invoice.SkaterPaymentAccountTransactions.map(({ amountInCents, date }) => ({
			formattedDate: formatDate(date),
			paymentAmount: formatCurrency(-amountInCents)
		}));
</script>

<PageHeader title={`Invoice - ${$page.params.id}`} />

<InvoiceDisplay
	id={data.invoice.id}
	skaterFirstName={data.invoice.Skater.firstName}
	skaterLastName={data.invoice.Skater.lastName}
	invoiceDate={formatDate(data.invoice.invoiceDate)}
	{charges}
	{payments}
	previousBillAmount={formatCurrency(data.invoice.previousAmountDueInCents)}
	outstandingBalance={formatCurrency(data.invoice.outstandingBalanceInCents)}
	hstAmount={formatCurrency(data.invoice.hstAmountInCents)}
	amountDue={formatCurrency(data.invoice.amountDueInCents)}
	chargesTotal={formatCurrency(data.invoice.chargesTotalInCents)}
/>
