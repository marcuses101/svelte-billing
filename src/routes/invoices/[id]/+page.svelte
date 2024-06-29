<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { page } from '$app/stores';
	import InvoiceDisplay from '../../skaters/[id]/invoices/current/InvoiceDisplay.svelte';
	import { formatCurrency } from '$lib/formatCurrency';
	import { formatDate } from '$lib/formatDate';
	import type { ComponentProps } from 'svelte';
	import { HST_PERCENTAGE } from '$lib/shared';
	export let data;

	const charges: ComponentProps<InvoiceDisplay>['charges'] = data.invoice.InvoiceLineItems.map(
		({ amountInCents, date, description }) => ({
			formattedDate: formatDate(date),
			chargeAmount: formatCurrency(amountInCents),
			description
		})
	);
	const payments: ComponentProps<InvoiceDisplay>['payments'] =
		data.invoice.SkaterPaymentAccountTransactions.map(({ amountInCents, date }) => ({
			formattedDate: formatDate(date),
			paymentAmount: formatCurrency(-amountInCents)
		}));
	console.log({ data, payments, charges });
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
	taxes={[{taxAmount: formatCurrency(data.invoice.hstAmountInCents),percentage:HST_PERCENTAGE, description:"HST"}]}
	amountDue={formatCurrency(data.invoice.amountDueInCents)}
	chargesTotal={formatCurrency(data.invoice.chargesTotalInCents)}
/>
