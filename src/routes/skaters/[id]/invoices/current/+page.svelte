<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import InvoiceDisplay from './InvoiceDisplay.svelte';
	import { formatCurrency } from '$lib/formatCurrency';
	import { formatDate } from '$lib/formatDate';

	export let data;
	const {
		skater: { firstName, lastName },
		lineItems,
		lastInvoice
	} = data;
	const id = 'TBD';
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

	const chargesTotalInCents = lineItems.reduce(
		(acc, { amountInCents }) => (acc += amountInCents),
		0
	);
	const previousAmountDueInCents = lastInvoice?.amountDueInCents ?? 0;
	const paymentsTotal = data.skaterInfo.Account.AccountTransaction.reduce(
		(acc, { amountInCents }) => acc + amountInCents,
		0
	);
	const outstandingBalanceInCents = previousAmountDueInCents - paymentsTotal;
	const amountDueInCents = outstandingBalanceInCents + chargesTotalInCents;
	const chargesTotal = formatCurrency(chargesTotalInCents);
	const amountDue = formatCurrency(amountDueInCents);
	const outstandingBalance = formatCurrency(outstandingBalanceInCents);
	const payments: ComponentProps<InvoiceDisplay>['payments'] =
		data.skaterInfo.Account.AccountTransaction.map(({ amountInCents, date }) => ({
			formattedDate: formatDate(date),
			paymentAmount: formatCurrency(amountInCents)
		}));
	const previousBillAmount = formatCurrency(lastInvoice?.amountDueInCents ?? 0);
</script>

<InvoiceDisplay
	{id}
	skaterLastName={lastName}
	skaterFirstName={firstName}
	{invoiceDate}
	{taxes}
	{charges}
	{payments}
	{amountDue}
	{previousBillAmount}
	{chargesTotal}
	{outstandingBalance}
/>
