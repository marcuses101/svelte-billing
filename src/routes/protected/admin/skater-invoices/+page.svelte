<script lang="ts">
	import { enhance } from '$app/forms';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import StyledTable from '$lib/components/StyledTable.svelte';
	import { errorToast, successToast } from '$lib/components/toaster.svelte';
	import { formatCurrency } from '$lib/formatCurrency';
	import { formatDate } from '$lib/formatDate.js';
	import CheckmarkIcon from '$lib/icons/CheckmarkIcon.svelte';
	import ErrorIcon from '$lib/icons/ErrorIcon.svelte';
	import InfoIcon from '$lib/icons/InfoIcon.svelte';
	import { EmailConfirmation, type EmailDeliveryStatus } from '@prisma/client';
	let { data } = $props();
	const rows: {
		invoiceId: string;
		name: string;
		humanReadableId: number;
		invoiceHref: string;
		skaterHref: string;
		amountDue: string;
		date: string;
		emailDeliveryStatus: EmailDeliveryStatus;
		emailConfirmation: EmailConfirmation;
		userId: string;
	}[] = data.invoices.map((invoice) => {
		return {
			invoiceId: invoice.id,
			name: `${invoice.Skater.firstName} ${invoice.Skater.lastName}`,
			date: formatDate(invoice.invoiceDate),
			humanReadableId: invoice.humanReadableId,
			amountDue: formatCurrency(invoice.amountDueInCents),
			invoiceHref: `/protected/admin/skater-invoices/${invoice.id}`,
			skaterHref: `/protected/admin/skaters/${invoice.skaterId}`,
			emailDeliveryStatus: invoice.emailDeliveryStatus,
			emailConfirmation: invoice.Skater.User.emailConfirmation,
			userId: invoice.Skater.User.id
		};
	});
</script>

<PageHeader title="Invoices" />

<StyledTable>
	{#snippet head()}
		<tr>
			<th>Invoice Id</th>
			<th>Invoice Date</th>
			<th>Skater Name</th>
			<th class="text-right">Invoice Amount</th>
			<th>Email Status</th>
		</tr>
	{/snippet}
	{#each rows as { date, invoiceId, name, invoiceHref, humanReadableId, skaterHref, amountDue, emailDeliveryStatus, emailConfirmation, userId }}
		<tr>
			<td>
				<a class="link link-primary" href={invoiceHref}>{humanReadableId}</a>
			</td>
			<td>{date}</td>
			<td> <a class="link link-primary" href={skaterHref}> {name}</a></td>
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
					<form
						use:enhance={() =>
							async ({ update, result }) => {
								if (result.type === 'success') {
									successToast('Email Queued');
								} else {
									errorToast('Failed to queue email');
								}
								await update();
							}}
						method="POST"
					>
						<input type="hidden" name="invoice-id" value={invoiceId} />
						<button class="btn btn-sm btn-outline btn-secondary" type="submit">
							Send Invoice Email
						</button>
					</form>
				{:else}
					<a href={`/protected/admin/users/${userId}`} class="gap-2 badge badge-warning p-3">
						<InfoIcon />
						Client Email not confirmed
					</a>
				{/if}
			</td>
		</tr>
	{/each}
</StyledTable>
