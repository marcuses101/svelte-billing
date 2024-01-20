<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import InvoiceDisplay from '../current/InvoiceDisplay.svelte';
	import { formatCurrency } from '$lib/formatCurrency';
	export let data;
	const { invoice, skater, lessons, chargesTotal } = data;
	const { invoiceDate: invoiceDateDate } = invoice;
	const formatDate = new Intl.DateTimeFormat('en-CA', { dateStyle: 'short' }).format;
	const invoiceDate = formatDate(invoiceDateDate);
	const charges: ComponentProps<InvoiceDisplay>['charges'] = lessons.map(
		({ lessonCostPerSkaterInCents, date, numberOfSkaters, lessonTimeInMinutes }) => ({
			formattedDate: formatDate(date),
			chargeAmount: formatCurrency(lessonCostPerSkaterInCents / 100),
			description:
				numberOfSkaters === 1
					? `${lessonTimeInMinutes} minute private lessons`
					: `${lessonTimeInMinutes} minute group lesson (${numberOfSkaters} skaters)`
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
		chargesTotal: formatCurrency(chargesTotal / 100)
	};
</script>

<InvoiceDisplay {...props} />
