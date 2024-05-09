<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import InvoiceDisplay from '../current/InvoiceDisplay.svelte';
	import { formatCurrency } from '$lib/formatCurrency';
	import { formatDate } from '$lib/formatDate';

	export let data;

	const { invoice, skater, lessonsTotalInCents } = data;

	const invoiceDate = formatDate(invoice.invoiceDate);

	const charges: ComponentProps<InvoiceDisplay>['charges'] = invoice.InvoiceLineItems.map(
		({ amountInCents, date, description }) => ({
			formattedDate: formatDate(date),
			chargeAmount: formatCurrency(amountInCents),
			description
		})
	);
	const props: ComponentProps<InvoiceDisplay> = {
		id: invoice.id,
		skaterFirstName: skater.firstName,
		skaterLastName: skater.lastName,
		invoiceDate: invoiceDate,
		charges: charges,
		payments: [],
		previousBillAmount: '',
		outstandingBalance: '',
		taxes: [],
		amountDue: '',
		chargesTotal: formatCurrency(lessonsTotalInCents)
	};
</script>

<InvoiceDisplay {...props} />
