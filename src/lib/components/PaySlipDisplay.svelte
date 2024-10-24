<!-- @migration-task Error while migrating Svelte code: `<tr>` is invalid inside `<table>` -->
<script lang="ts">
	import { formatCurrency } from '$lib/formatCurrency';
	import { formatDate } from '$lib/formatDate';
	import { HST_PERCENTAGE } from '$lib/shared';

	export let firstName: string;
	export let humanReadableId: string;
	export let lastName: string;
	export let id: string;
	export let date: Date;
	export let previousPaySlipAmountInCents: number;
	export let amountDueInCents: number;
	export let chargesTotalInCents: number;
	export let commissionAmountInCents: number;
	export let coachPaymentTransactions: { date: Date; amountInCents: number }[];
	export let lineItems: { date: Date; description: string; amountInCents: number }[];
	export let outstandingBalanceInCents: number;
	export let hstAmountInCents: number;
	export let commissionPercentage: number;

	const name = `${firstName} ${lastName}`;
	const formattedDate = formatDate(date);
	const previousPaySlipAmount = formatCurrency(previousPaySlipAmountInCents ?? 0);
	const payments = coachPaymentTransactions.map((payment) => ({
		paymentDate: formatDate(payment.date),
		paymentAmount: formatCurrency(-payment.amountInCents)
	}));

	const outstandingBalance = formatCurrency(outstandingBalanceInCents);
	const charges = lineItems.map((line) => {
		return {
			date: formatDate(line.date),
			description: line.description,
			amount: formatCurrency(line.amountInCents)
		};
	});
	const chargesTotal = formatCurrency(chargesTotalInCents);
	const commission = formatCurrency(-commissionAmountInCents);
	const subtotal = formatCurrency(chargesTotalInCents - commissionAmountInCents);

	const hst = formatCurrency(hstAmountInCents);

	const amountDue = formatCurrency(amountDueInCents);
</script>

<div class="max-w-5xl mx-auto" data-id={id}>
	<section class="flex justify-between mb-4 px-4">
		<h2 class="text-xl font-bold">
			{name}
		</h2>
		<div class="grid grid-cols-2 gap-2">
			<strong class="text-right">Pay Slip Id: </strong><span class="text-right">
				{humanReadableId}
			</span>
			<strong class="text-right">Pay Slip Date: </strong>
			<span class="text-right">
				{formattedDate}
			</span>
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
					<tbody>
						<tr class="bg-neutral text-neutral-content text-lg">
							<td>Outstanding Balance</td>
							<td>{outstandingBalance}</td>
						</tr>
					</tbody>
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
					{#if commissionAmountInCents > 0}
						<tr>
							<td>Commission ({commissionPercentage}%)</td>
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
					{#if hstAmountInCents > 0}
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
