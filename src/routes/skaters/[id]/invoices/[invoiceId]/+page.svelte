<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import InvoiceDisplay from '../current/InvoiceDisplay.svelte';
	export let data;
	const { invoice, skater } = data;
	const { invoiceDate: invoiceDateDate } = invoice;
	const invoiceDate = new Intl.DateTimeFormat('en-CA', { dateStyle: 'short' }).format(
		invoiceDateDate
	);
	const props: ComponentProps<InvoiceDisplay> = {
		id: invoice.id,
		skaterFirstName: skater.firstName,
		skaterLastName: skater.lastName,
		invoiceDate: invoiceDate,
		charges: [],
		payments: [],
		previousBillAmount: '',
		outstandingBalance: '',
		taxes: [],
		amountDue: '',
		chargesTotal: ''
	};
</script>

<InvoiceDisplay {...props} />
