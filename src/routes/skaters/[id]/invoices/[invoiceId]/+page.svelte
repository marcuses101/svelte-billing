<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import InvoiceDisplay from '$lib/components/InvoiceDisplay.svelte';
	import { formatCurrency } from '$lib/formatCurrency';
	import { formatDate } from '$lib/formatDate';
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
			paymentAmount: formatCurrency(amountInCents)
		}));
</script>

<InvoiceDisplay
	id={data.invoice.id}
	skaterFirstName={data.skater.firstName}
	skaterLastName={data.skater.lastName}
	invoiceDate={formatDate(data.invoice.invoiceDate)}
	{charges}
	{payments}
	hstAmount={formatCurrency(data.invoice.hstAmountInCents)}
	previousBillAmount={formatCurrency(data.invoice.previousAmountDueInCents)}
	outstandingBalance={formatCurrency(data.invoice.outstandingBalanceInCents)}
	amountDue={formatCurrency(data.invoice.amountDueInCents)}
	chargesTotal={formatCurrency(data.invoice.chargesTotalInCents)}
/>
