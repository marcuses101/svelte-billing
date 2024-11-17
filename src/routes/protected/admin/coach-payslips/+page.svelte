<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import StyledTable from '$lib/components/StyledTable.svelte';
	import { formatCurrency } from '$lib/formatCurrency';
	import { formatDate } from '$lib/formatDate.js';
	import CheckmarkIcon from '$lib/icons/CheckmarkIcon.svelte';
	import ErrorIcon from '$lib/icons/ErrorIcon.svelte';
	import InfoIcon from '$lib/icons/InfoIcon.svelte';

	let { data } = $props();
	const rows = data.paySlips.map((slip) => {
		const coachId = slip.Coach.id;
		const date = formatDate(slip.date);
		const { firstName, lastName } = slip.Coach.User;
		const name = `${firstName} ${lastName}`;

		return {
			humanReadableId: slip.humanReadableId,
			id: slip.id,
			coachId,
			name,
			date,
			amountDue: formatCurrency(slip.amountDueInCents),
			emailDeliveryStatus: slip.emailDeliveryStatus,
			emailConfirmation: slip.Coach.User.emailConfirmation
		};
	});
</script>

<PageHeader title="Pay Slips" />

<StyledTable>
	{#snippet head()}
		<tr>
			<th>Pay Slip Id</th>
			<th>Date</th>
			<th>Coach Name</th>
			<th class="text-right">Pay Slip Total</th>
			<th>Email Delivery Status</th>
		</tr>
	{/snippet}
	{#each rows as { id, name, amountDue, coachId, date, emailDeliveryStatus, humanReadableId, emailConfirmation }}
		<tr>
			<td>
				<a class="link link-primary" href={`/protected/admin/coach-payslips/${id}`}
					>{humanReadableId}</a
				>
			</td>
			<td>{date}</td>
			<td>
				<a class="link link-primary" href={`/protected/admin/coaches/${coachId}`}>
					{name}
				</a>
			</td>
			<td class="text-right">{amountDue}</td>
			<td>
				{#if emailDeliveryStatus === 'Delivered'}
					<div class="gap-2 badge badge-success p-3">
						<CheckmarkIcon />
						Delivered
					</div>
				{:else if emailDeliveryStatus === 'Rejected'}
					<div class="gap-2 badge badge-error p-3">
						<ErrorIcon />
						Failed To Deliver
					</div>
				{:else if emailDeliveryStatus === 'Pending'}
					<div class="gap-2 badge badge-info p-3">
						<InfoIcon />
						Pending
					</div>
				{:else if emailDeliveryStatus === 'NotSent' && emailConfirmation === 'Confirmed'}
					<form method="POST">
						<input type="hidden" name="payslip-id" value={id} />
						<button class="btn btn-sm btn-outline btn-secondary" type="submit">
							Send Invoice Email
						</button>
					</form>
				{:else}
					<div class="gap-2 badge badge-warning p-3">
						<InfoIcon />
						Coach Email Not Confirmed
					</div>
				{/if}
			</td>
		</tr>
	{/each}
</StyledTable>
