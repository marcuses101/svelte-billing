<script>
	import StyledTable from '$lib/components/StyledTable.svelte';
	import { formatCurrency } from '$lib/formatCurrency';
	import { formatDate } from '$lib/formatDate';

	export let data;
</script>

<StyledTable>
	<tr slot="head">
		<td>Date</td>
		<td class="text-right">Pay Slip Total</td>
	</tr>
	{#each data.paySlips as paySlip}
		<tr>
			<td>
				<a
					class="link link-primary font-bold no-underline"
					href={`/protected/my-info/pay-slips/${paySlip.id}`}
				>
					{formatDate(paySlip.date)}
				</a>
			</td>
			<td class="text-right">{formatCurrency(paySlip.amountDueInCents)}</td>
		</tr>
	{:else}
		<tr><td>No Payslips Logged</td></tr>
	{/each}
</StyledTable>
