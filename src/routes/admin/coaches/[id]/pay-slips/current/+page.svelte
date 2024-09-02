<script lang="ts">
	import PaySlipDisplay from '$lib/components/PaySlipDisplay.svelte';
	import { ACCOUNT_TRANSACTION_TYPE } from '$lib/defs';
	import { HST_PERCENTAGE } from '$lib/shared.js';

	export let data;
	const paySlipId = 'TBD';
</script>

<PaySlipDisplay
	data={{
		hstAmountInCents: data.paySlip.hstAmountInCents,
		date: new Date(),
		createdOn: new Date(),
		chargesTotalInCents: data.paySlip.chargesTotalInCents,
		id: paySlipId,
		amountDueInCents: data.paySlip.amountDueInCents,
		outstandingBalanceInCents: data.paySlip.outstandingBalanceInCents,
		coachId: data.coach.id,
		Coach: data.coach,
		billingBatchId: 'TBD',
		coachRevenueInCents: data.paySlip.coachRevenueInCents,
		commissionPercentage: HST_PERCENTAGE,
		CoachPaySlipLineItems: data.paySlip.coachPaySlipLineItems.map((entry) => ({
			id: '',
			date: entry.date,
			amountInCents: entry.amountInCents,
			description: entry.description,
			lessonId: entry.lessonId,
			coachPaySlipId: paySlipId
		})),
		previousCoachPaySlipId: data.paySlip.previousCoachPaySlipId ?? null,
		commissionAmountInCents: data.paySlip.commissionAmountInCents,
		previousPaySlipAmountInCents: data.paySlip.previousPaySlipAmountInCents,
		CoachPaymentAccountTransactions: data.paySlip.paymentAccountTransactions.map((entry) => ({
			coachPaySlipId: 'TBD',
			amountInCents: entry.amountInCents,
			date: entry.date,
			id: '',
			accountId: entry.accountId,
			accountTransactionTypeCode: ACCOUNT_TRANSACTION_TYPE.COACH_PAYMENT,
			coachPaymentPaySlipId: '',
			chargeInvoiceId: '',
			paymentRecordedInvoiceId: ''
		}))
	}}
/>
