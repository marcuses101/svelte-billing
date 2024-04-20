<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import InvoiceDisplay from './InvoiceDisplay.svelte';
	import { formatCurrency } from '$lib/formatCurrency';

	export let data;
	const {
		skater: { firstName, lastName },
		lineItems
	} = data;
	const id = 'TBD';
	const formatDate = new Intl.DateTimeFormat('en-CA', { dateStyle: 'short' }).format;
	const invoiceDate = formatDate(new Date());
	const taxes: ComponentProps<InvoiceDisplay>['taxes'] = [
		{ description: 'HST', percentage: '13%', taxAmount: formatCurrency(69, false) }
	];
	const charges: ComponentProps<InvoiceDisplay>['charges'] = lineItems.map(
		({ date, amountInCents, description }) => {
			return {
				description,
				formattedDate: formatDate(date),
				chargeAmount: formatCurrency(amountInCents)
			};
		}
	);

	// TODO determine actual charges
	const chargesTotalInCents = lineItems.reduce(
		(acc, { amountInCents }) => (acc += amountInCents),
		0
	);
	const chargesTotal = formatCurrency(chargesTotalInCents);

	const amountDue = formatCurrency(100.25, false);
	const outstandingBalance = formatCurrency(20, false);
	const payments: ComponentProps<InvoiceDisplay>['payments'] = [];
	const previousBillAmount = formatCurrency(40);
</script>

<InvoiceDisplay
	{id}
	skaterLastName={lastName}
	skaterFirstName={firstName}
	{invoiceDate}
	{taxes}
	{charges}
	{payments}
	{previousBillAmount}
	{amountDue}
	{chargesTotal}
	{outstandingBalance}
/>
