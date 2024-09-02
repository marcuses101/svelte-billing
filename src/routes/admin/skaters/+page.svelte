<script lang="ts">
	import AddButton from '$lib/components/AddButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import StyledTable from '$lib/components/StyledTable.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import CheckmarkIcon from '$lib/icons/CheckmarkIcon.svelte';
	import ErrorIcon from '$lib/icons/ErrorIcon.svelte';
	import InfoIcon from '$lib/icons/InfoIcon.svelte';

	export let data;
	export let form;
</script>

{#if form?.ok}
	<Toast alertType="success">Confirmation Email Sent</Toast>
{:else if form && !form.ok}
	<Toast alertType="error">{form.message}</Toast>
{/if}
<PageHeader title="Skater List" />
<AddButton href="/admin/skaters/create">Add Skater</AddButton>
<StyledTable containerClass="mt-8">
	<tr slot="head">
		<td>Name</td>
		<td>Email</td>
		<td>Type</td>
		<td>Email Confirmation</td>
	</tr>
	{#each data.skaters as { id, firstName, lastName, confirmationEmailDeliveryStatus, emailConfirmation, email, skaterTypeCode }}
		<tr>
			<td style={`--transition-name:skater-${id}`}>
				<a
					class="link link-primary font-bold no-underline [view-transition-name:var(--transition-name)]"
					href={`/admin/skaters/${id}`}
				>
					{`${firstName} ${lastName}`}
				</a>
			</td>
			<td>{email}</td>
			<td>{skaterTypeCode}</td>
			<td>
				{#if emailConfirmation === 'Confirmed'}
					<div class="gap-2 badge badge-success p-3">
						<CheckmarkIcon />
						Confirmed
					</div>
				{:else if emailConfirmation === 'Invalid'}
					<div class="gap-2 badge badge-error p-3">
						<ErrorIcon />
						Invalid Email Address
					</div>
				{:else if emailConfirmation === 'Pending' && confirmationEmailDeliveryStatus === 'NotSent'}
					<form method="POST" action="?/send-confirmation">
						<input type="hidden" name="skater-id" value={id} />
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
	{:else}
		<tr>
			<td>No Skaters Created</td>
		</tr>
	{/each}
</StyledTable>
