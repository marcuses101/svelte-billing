<script lang="ts">
	import { formatCurrency } from '$lib/formatCurrency';
	import { formatDate } from '$lib/formatDate';
	import type { PaySlipData } from '$lib/server/db';
	import { HST_PERCENTAGE } from '$lib/shared';

	export let data: PaySlipData;
	const { firstName, lastName } = data.Coach.User;
	const name = `${firstName} ${lastName}`;
	const id = data.id;
	const date = formatDate(data.date);
	const previousPaySlipAmount = formatCurrency(data.previousPaySlipAmountInCents ?? 0);
	const payments = data.CoachPaymentAccountTransactions.map((payment) => ({
		paymentDate: formatDate(payment.date),
		paymentAmount: formatCurrency(-payment.amountInCents)
	}));
	const outstandingBalance = formatCurrency(data.outstandingBalanceInCents);
	const charges = data.CoachPaySlipLineItems.map((line) => {
		return {
			date: formatDate(line.date),
			description: line.description,
			amount: formatCurrency(line.amountInCents)
		};
	});
	const chargesTotal = formatCurrency(data.chargesTotalInCents);
	const commission = formatCurrency(-data.commissionAmountInCents);
	const subtotal = formatCurrency(data.chargesTotalInCents - data.commissionAmountInCents);

	const hst = formatCurrency(data.hstAmountInCents);

	const amountDue = formatCurrency(data.amountDueInCents);
</script>

<div class="max-w-5xl mx-auto">
	<section class="flex justify-between mb-4 px-4">
		<h2 class="text-xl font-bold">
			{name}
		</h2>
		<div class="grid grid-cols-2 gap-2">
			<strong class="text-right">Pay Slip Id: </strong><span class="text-right">{id}</span>
			<strong class="text-right">Pay Slip Date: </strong><span class="text-right">{date}</span>
		</div>
	</section>
	<section class="flex flex-wrap gap-4 mb-4">
		<article
			class="flex-1 min-w-[min(300px,100%)] justify-between card overflow-hidden bg-base-300 text-base-content"
		>
			<h3 class="text-xl m-4 font-semibold">Previous Bill</h3>
			<div class="flex flex-1 justify-between flex-col">
				<table class="table">
					<tbody>
						<tr>
							<td>Previous bill amount</td>
							<td>{previousPaySlipAmount}</td>
						</tr>
						{#each payments as payment}
							<tr>
								<td>Payment - {payment.paymentDate}</td>
								<td>{payment.paymentAmount}</td>
							</tr>
						{/each}
					</tbody>
				</table>
				<table class="table">
					<tr class="bg-neutral text-neutral-content text-lg">
						<td>Outstanding Balance</td>
						<td>{outstandingBalance}</td>
					</tr>
				</table>
			</div>
		</article>
		<article
			class="flex-1 min-w-[min(300px,100%)] justify-between card overflow-hidden bg-base-300 text-base-content"
		>
			<h3 class="text-xl m-4 font-semibold">Current Bill</h3>
			<table class="table">
				<tbody>
					<tr>
						<td>Charges Total</td>
						<td>{chargesTotal}</td>
					</tr>
					{#if data.commissionAmountInCents > 0}
						<tr>
							<td>Commission ({data.commissionPercentage}%)</td>
							<td>{commission}</td>
						</tr>
					{/if}
					<tr>
						<td class="font-bold">Subtotal</td>
						<td>{subtotal}</td>
					</tr>
					<tr>
						<td class="whitespace-pre">{' '}</td>
						<td class="whitespace-pre">{' '}</td>
					</tr>
					<tr>
						<td>Outstanding Balance</td>
						<td>{outstandingBalance}</td>
					</tr>
					{#if data.hstAmountInCents > 0}
						<tr>
							<td>HST ({HST_PERCENTAGE}%)</td>
							<td>{hst}</td>
						</tr>
					{/if}
					<tr class="bg-neutral text-neutral-content text-lg">
						<td>Amount Owed</td>
						<td>{amountDue}</td>
					</tr>
				</tbody>
			</table>
		</article>
	</section>
	<section class="mb-4 card bg-base-300 text-base-content overflow-hidden">
		<h3 class="text-xl m-4 font-semibold">Detailed Charges</h3>
		<table class="table">
			<thead>
				<tr>
					<th>Date</th>
					<th>Description</th>
					<th>Charge</th>
				</tr>
			</thead>
			<tbody>
				{#each charges as charge}
					<tr>
						<td>{charge.date}</td>
						<td>{charge.description}</td>
						<td>{charge.amount}</td>
					</tr>
				{/each}
				<tr class="bg-neutral text-neutral-content text-lg">
					<td>Charges Total</td>
					<td></td>
					<td>{chargesTotal}</td>
				</tr>
			</tbody>
		</table>
	</section>
</div>

<style>
	th:last-of-type,
	td:last-of-type {
		text-align: right;
		font-weight: bold;
	}
</style>
