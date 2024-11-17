<script lang="ts">
	import { enhance } from '$app/forms';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import StyledTable from '$lib/components/StyledTable.svelte';
	import { errorToast, successToast } from '$lib/components/toaster.svelte.js';
	import CheckmarkIcon from '$lib/icons/CheckmarkIcon.svelte';
	import ErrorIcon from '$lib/icons/ErrorIcon.svelte';
	import InfoIcon from '$lib/icons/InfoIcon.svelte';
	import type { SubmitFunction } from './$types.js';

	let { data } = $props();

	const enhanceFunction: SubmitFunction =
		() =>
		async ({ update, result }) => {
			if (result.type === 'success') {
				successToast('Email Queued');
			} else {
				errorToast('Failed to queue email');
			}
			await update();
		};
</script>

<PageHeader title="Users" />

<section class="mb-10">
	<h2 class="text-xl mb-4">Admins</h2>
	<StyledTable>
		{#snippet head()}
			<tr>
				<td>Name</td>
				<td>Email</td>
				<td>Roles</td>
				<td>Email Confirmation</td>
			</tr>
		{/snippet}
		{#each data.admins as { id, firstName, lastName, confirmationEmailDeliveryStatus, emailConfirmation, email, UserRoles }}
			<tr>
				<td style={`--transition-name:user-${id}`}>
					<a
						class="link link-primary font-bold no-underline [view-transition-name:var(--transition-name)]"
						href={`/protected/admin/users/${id}`}
					>
						{`${firstName} ${lastName}`}
					</a>
				</td>
				<td>{email}</td>
				<td>{UserRoles.map((role) => role.roleName).join(', ')}</td>
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
						<form
							method="POST"
							action="?/send-confirmation"
							use:enhance={enhanceFunction}
							data-sveltekit-noscroll
						>
							<input type="hidden" name="user-id" value={id} />
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
				<td>No Users Created</td>
			</tr>
		{/each}
	</StyledTable>
</section>

<section class="mb-10">
	<h2 class="text-xl mb-4">Coaches</h2>
	<StyledTable>
		{#snippet head()}
			<tr>
				<td>Name</td>
				<td>Email</td>
				<td>Roles</td>
				<td>Email Confirmation</td>
			</tr>
		{/snippet}
		{#each data.coaches as { id, firstName, lastName, confirmationEmailDeliveryStatus, emailConfirmation, email, UserRoles }}
			<tr>
				<td style={`--transition-name:user-${id}`}>
					<a
						class="link link-primary font-bold no-underline [view-transition-name:var(--transition-name)]"
						href={`/protected/admin/users/${id}`}
					>
						{`${firstName} ${lastName}`}
					</a>
				</td>
				<td>{email}</td>
				<td>{UserRoles.map((role) => role.roleName).join(', ')}</td>
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
						<form
							method="POST"
							action="?/send-confirmation"
							use:enhance={enhanceFunction}
							data-sveltekit-noscroll
						>
							<input type="hidden" name="user-id" value={id} />
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
				<td>No Users Created</td>
			</tr>
		{/each}
	</StyledTable>
</section>

<section class="mb-10">
	<h2 class="text-xl mb-4">Clients</h2>
	<StyledTable>
		{#snippet head()}
			<tr>
				<td>Name</td>
				<td>Email</td>
				<td>Roles</td>
				<td>Email Confirmation</td>
			</tr>
		{/snippet}
		{#each data.clients as { id, firstName, lastName, confirmationEmailDeliveryStatus, emailConfirmation, email, UserRoles }}
			<tr>
				<td style={`--transition-name:user-${id}`}>
					<a
						class="link link-primary font-bold no-underline [view-transition-name:var(--transition-name)]"
						href={`/protected/admin/users/${id}`}
					>
						{`${firstName} ${lastName}`}
					</a>
				</td>
				<td>{email}</td>
				<td>{UserRoles.map((role) => role.roleName).join(', ')}</td>
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
						<form
							use:enhance={enhanceFunction}
							method="POST"
							action="?/send-confirmation"
							data-sveltekit-noscroll
						>
							<input type="hidden" name="user-id" value={id} />
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
				<td>No Users Created</td>
			</tr>
		{/each}
	</StyledTable>
</section>
