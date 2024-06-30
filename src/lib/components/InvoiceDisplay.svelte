<script lang="ts">
	import { HST_PERCENTAGE } from '$lib/shared';

	export let id: string;
	export let skaterFirstName: string;
	export let skaterLastName: string;
	export let invoiceDate: string;
	export let charges: { formattedDate: string; description: string; chargeAmount: string }[];
	export let payments: { formattedDate: string; paymentAmount: string }[];
	export let previousBillAmount: string;
	export let outstandingBalance: string;
	export let hstAmount: string;
	export let amountDue: string;
	export let chargesTotal: string;
</script>

<div class="max-w-5xl mx-auto mt-4">
	<section class="flex justify-between mb-4 px-4">
		<h2 class="text-4xl font-bold">
			{skaterFirstName}
			{skaterLastName}
		</h2>
		<div class="grid grid-cols-2 gap-2">
			<strong class="text-right">Invoice Id: </strong><span class="text-right">{id}</span>
			<strong class="text-right">Invoice Date: </strong><span class="text-right">{invoiceDate}</span
			>
		</div>
	</section>
	<section class="flex flex-wrap gap-4 mb-4">
		<article
			class="flex-1 min-w-[min(300px,100%)] justify-between card overflow-hidden bg-base-300 text-base-content"
		>
			<h3 class="text-xl m-4 font-semibold">Previous Bill</h3>
			<div class="flex flex-1 flex-col justify-between">
				<table class="table">
					<tbody>
						<tr>
							<td>Previous bill amount</td>
							<td>{previousBillAmount}</td>
						</tr>
						{#each payments as payment}
							<tr>
								<td>Payment - {payment.formattedDate}</td>
								<td> {payment.paymentAmount}</td>
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
						<td>Outstanding Balance</td>
						<td>{outstandingBalance}</td>
					</tr>
					<tr>
						<td>Charges Total</td>
						<td>{chargesTotal}</td>
					</tr>
					<tr>
						<td>HST ({HST_PERCENTAGE}%)</td>
						<td>{hstAmount}</td>
					</tr>
					<tr class="bg-neutral text-neutral-content text-lg">
						<td>Amount Due</td>
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
						<td>{charge.formattedDate}</td>
						<td>{charge.description}</td>
						<td>{charge.chargeAmount}</td>
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
