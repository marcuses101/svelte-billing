<script lang="ts">
	import PaySlipDisplay from '$lib/components/PaySlipDisplay.svelte';
	import { HST_PERCENTAGE } from '$lib/shared.js';
	import type { ComponentProps } from 'svelte';

	let { data } = $props();
	const PLACEHOLDER_ID = 'TBD';
	const { firstName, lastName } = data.coach.User;
	const lineItems: ComponentProps<PaySlipDisplay>['lineItems'] =
		data.paySlip.coachPaySlipLineItems.map((line) => ({
			date: new Date(line.date),
			description: line.description,
			amountInCents: line.amountInCents
		}));
	const coachPaymentTransactions: ComponentProps<PaySlipDisplay>['coachPaymentTransactions'] =
		data.paySlip.paymentAccountTransactions.map((transaction) => ({
			amountInCents: transaction.amountInCents,
			date: transaction.date
		}));
</script>

<PaySlipDisplay
	{firstName}
	{lastName}
	date={new Date()}
	id={PLACEHOLDER_ID}
	humanReadableId={PLACEHOLDER_ID}
	amountDueInCents={data.paySlip.amountDueInCents}
	previousPaySlipAmountInCents={data.paySlip.previousPaySlipAmountInCents}
	hstAmountInCents={data.paySlip.hstAmountInCents}
	chargesTotalInCents={data.paySlip.chargesTotalInCents}
	outstandingBalanceInCents={data.paySlip.outstandingBalanceInCents}
	commissionPercentage={HST_PERCENTAGE}
	commissionAmountInCents={data.paySlip.commissionAmountInCents}
	{lineItems}
	{coachPaymentTransactions}
/>
