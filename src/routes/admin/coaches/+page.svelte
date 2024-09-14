<script>
	import PageHeader from '$lib/components/PageHeader.svelte';
	import StyledTable from '$lib/components/StyledTable.svelte';
	import CheckmarkIcon from '$lib/icons/CheckmarkIcon.svelte';
	import ErrorIcon from '$lib/icons/ErrorIcon.svelte';
	import InfoIcon from '$lib/icons/InfoIcon.svelte';

	export let data;
</script>

<PageHeader title="Coaches" />
<a class="btn btn-outline btn-primary border-dashed w-full mb-4" href="admin/coaches/create">
	+ Add Coach
</a>

<StyledTable>
	<tr slot="head">
		<td>Name</td>
		<td>Email</td>
		<td>Email Confirmation</td>
	</tr>
	{#each data.coaches as { id, firstName, lastName, email, emailConfirmation, confirmationEmailDeliveryStatus }}
		<tr>
			<td style={`--transition-name:coach-${id}`}>
				<a
					class="link link-primary font-bold no-underline [view-transition-name:var(--transition-name)]"
					href={`/admin/coaches/${id}`}
				>
					{`${firstName} ${lastName}`}
				</a>
			</td>
			<td>{email}</td>
			<td>
				{#if emailConfirmation === 'Confirmed'}
					<div class="gap-2 badge badge-success p-3">
						<CheckmarkIcon />
						{emailConfirmation}
					</div>
				{:else if emailConfirmation === 'Invalid'}
					<div class="gap-2 badge badge-error p-3">
						<ErrorIcon />
						{emailConfirmation}
					</div>
				{:else if emailConfirmation === 'Pending' && confirmationEmailDeliveryStatus === 'NotSent'}
					<form method="POST" action="?/send-confirmation">
						<input type="hidden" name="coach-id" value={id} />
						<button class="btn btn-sm btn-outline btn-secondary" type="submit">
							Send Confirmation Email
						</button>
					</form>
				{:else if emailConfirmation === 'Pending' && (confirmationEmailDeliveryStatus === 'Pending' || confirmationEmailDeliveryStatus === 'Delivered')}
					<div class="gap-2 badge badge-info p-3">
						<InfoIcon />
						Pending
					</div>
				{/if}
			</td>
		</tr>
	{/each}
</StyledTable>
