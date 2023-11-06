<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import InvoiceDisplay from './InvoiceDisplay.svelte';
	import { formatCurrency } from '$lib/formatCurrency';

	export let data;
	const {
		skater: { firstName, lastName },
		lessons
	} = data;
	const id = 'TBD';
	const formatDate = new Intl.DateTimeFormat('en-CA', { dateStyle: 'short' }).format;
	const invoiceDate = formatDate(new Date());
	const taxes: ComponentProps<InvoiceDisplay>['taxes'] = [
		{ description: 'HST', percentage: '13%', taxAmount: formatCurrency(69) }
	];
	const charges: ComponentProps<InvoiceDisplay>['charges'] = lessons.map(
		({ date, chargeInCents, coachName, lessonTimeInMinutes, numberOfSkaters }) => {
			const lessonType = numberOfSkaters > 1 ? 'group' : 'private';
			return {
				description: `${lessonTimeInMinutes} minute ${lessonType} lesson (${coachName})`,
				formattedDate: formatDate(date),
				chargeAmount: formatCurrency(chargeInCents / 100)
			};
		}
	);
	const chargesTotal = formatCurrency(60);
	const amountDue = formatCurrency(100.25);
	const outstandingBalance = formatCurrency(20);
	const payments: ComponentProps<InvoiceDisplay>['payments'] = [];
	const currentBillTotal = formatCurrency(50);
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
	{currentBillTotal}
	{previousBillAmount}
	{amountDue}
	{chargesTotal}
	{outstandingBalance}
/>
