<script lang="ts">
	export let id: string;
	export let skaterFirstName: string;
	export let skaterLastName: string;
	export let invoiceDate: string;
	export let charges: { formattedDate: string; description: string; chargeAmount: string }[];
	export let payments: { formattedDate: string; paymentAmount: string }[];
	export let previousBillAmount: string;
	export let outstandingBalance: string;
	export let taxes: { description: string; percentage: string; taxAmount: string }[];
	export let amountDue: string;
	export let chargesTotal: string;
</script>

<div class="max-w-none">
	<section class="flex justify-between mb-4 px-4">
		<h2 class="text-xl font-bold">
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
			<h3 class="text-lg m-4 font-semibold">Previous Bill</h3>
			<table class="table">
				<tbody>
					<tr>
						<td>Previous bill amount</td>
						<td>{previousBillAmount}</td>
					</tr>
					{#each payments as payment}
						<tr>
							<td>Payment - {payment.paymentAmount}</td>
							<td>CR {payment.paymentAmount}</td>
						</tr>
					{:else}
						<tr>
							<td>Payment</td>
							<td
								>CR {new Intl.NumberFormat('en-CA', {
									style: 'currency',
									currency: 'CAD',
									currencyDisplay: 'narrowSymbol'
								}).format(0)}
							</td>
						</tr>
					{/each}
					<tr>
						<td class="whitespace-pre">{' '}</td>
						<td class="whitespace-pre">{' '}</td>
					</tr>
					<tr class="bg-neutral text-neutral-content text-lg">
						<td>Outstanding Balance</td>
						<td>{outstandingBalance}</td>
					</tr>
				</tbody>
			</table>
		</article>
		<article
			class="flex-1 min-w-[min(300px,100%)] justify-between card overflow-hidden bg-base-300 text-base-content"
		>
			<h3 class="text-lg m-4 font-semibold">Current Bill</h3>
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
					{#each taxes as tax}
						<tr>
							<td>{tax.description} {tax.percentage}</td>
							<td>{tax.taxAmount}</td>
						</tr>
					{/each}
					<tr class="bg-neutral text-neutral-content text-lg">
						<td>Amount Due</td>
						<td>{amountDue}</td>
					</tr>
				</tbody><tbody />
			</table>
		</article>
	</section>
	<section class="mb-4 card bg-base-300 text-base-content">
		<h3 class="text-lg m-4 font-semibold">Detailed Charges</h3>
		<table class="table table-xs md:table-md">
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
				{#each payments as payment}
					<tr>
						<td>{payment.formattedDate}</td>
						<td>Payment received</td>
						<td>{payment.paymentAmount}</td>
					</tr>
				{/each}
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
