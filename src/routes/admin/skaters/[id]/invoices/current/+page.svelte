<script lang="ts">
	import { formatCurrency } from '$lib/formatCurrency';
	import { formatDate } from '$lib/formatDate';
	import type { ComponentProps } from 'svelte';
	import InvoiceDisplay from '$lib/components/InvoiceDisplay.svelte';

	export let data;
	const {
		skater: { firstName, lastName },
		processedInvoice
	} = data;
	const id = 'TBD';

	const charges: ComponentProps<InvoiceDisplay>['charges'] = processedInvoice.lineItemsData.map(
		(entry) => {
			return {
				formattedDate: formatDate(entry.date),
				description: entry.description,
				chargeAmount: formatCurrency(entry.amountInCents)
			};
		}
	);
	const payments: ComponentProps<InvoiceDisplay>['payments'] = processedInvoice.payments.map(
		(entry) => {
			return {
				formattedDate: formatDate(entry.date),
				paymentAmount: formatCurrency(entry.amountInCents)
			};
		}
	);
</script>

<InvoiceDisplay
	{id}
	skaterLastName={lastName}
	skaterFirstName={firstName}
	invoiceDate={formatDate(new Date())}
	hstAmount={formatCurrency(processedInvoice.hstAmountInCents)}
	outstandingBalance={formatCurrency(processedInvoice.outstandingBalanceInCents)}
	amountDue={formatCurrency(processedInvoice.amountDueInCents)}
	chargesTotal={formatCurrency(processedInvoice.chargesTotalInCents)}
	previousBillAmount={formatCurrency(processedInvoice.previousAmountDueInCents)}
	{charges}
	{payments}
/>
