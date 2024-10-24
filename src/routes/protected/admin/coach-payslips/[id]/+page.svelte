<script lang="ts">
	import PaySlipDisplay from '$lib/components/PaySlipDisplay.svelte';
	import type { ComponentProps } from 'svelte';

	let { data } = $props();
	const paySlip = data.paySlip;
	const {
		id,
		date,
		amountDueInCents,
		hstAmountInCents,
		chargesTotalInCents,
		previousPaySlipAmountInCents,
		outstandingBalanceInCents,
		commissionPercentage,
		commissionAmountInCents,
		CoachPaySlipLineItems,
		CoachPaymentAccountTransactions,
		humanReadableId
	} = paySlip;
	const { firstName, lastName } = paySlip.Coach.User;
	const lineItems: ComponentProps<PaySlipDisplay>['lineItems'] = CoachPaySlipLineItems.map(
		(line) => ({
			date: line.date,
			amountInCents: line.amountInCents,
			description: line.description
		})
	);
	const coachPaymentTransactions: ComponentProps<PaySlipDisplay>['coachPaymentTransactions'] =
		CoachPaymentAccountTransactions.map((entry) => ({
			date: entry.date,
			amountInCents: entry.amountInCents
		}));
</script>

<PaySlipDisplay
	humanReadableId={humanReadableId.toString()}
	{firstName}
	{lastName}
	{date}
	{id}
	{amountDueInCents}
	previousPaySlipAmountInCents={previousPaySlipAmountInCents ?? 0}
	{hstAmountInCents}
	{chargesTotalInCents}
	{outstandingBalanceInCents}
	{commissionAmountInCents}
	{commissionPercentage}
	{lineItems}
	{coachPaymentTransactions}
/>
