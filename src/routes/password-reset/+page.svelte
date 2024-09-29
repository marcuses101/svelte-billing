<script lang="ts">
	import { enhance } from '$app/forms';

	import { exhaustiveCheck } from '$lib/exhaustiveCheck';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import SubmitButton from '$lib/components/SubmitButton.svelte';
	import CheckmarkIcon from '$lib/icons/CheckmarkIcon.svelte';
	import ErrorIcon from '$lib/icons/ErrorIcon.svelte';
	import { fade } from 'svelte/transition';
	export let data;
	export let form;
	let errorMessage: string | null = null;
	$: errorType = form?.error?.type;

	$: {
		switch (errorType) {
			case 'INVALID_TOKEN':
				errorMessage = 'Password reset token is invalid';
				break;
			case 'EXPIRED_TOKEN':
				errorMessage = 'Reset token has expired. Please request another reset token';
				break;
			case 'MISSING_FIELDS':
				errorMessage = 'Missing fields: ';
				break;
			case 'USER_NOT_FOUND':
				errorMessage = 'User not found';
				break;
			case 'INVALID_PASSWORD':
				errorMessage = 'Password must be greater than 7 characters';
				break;
			case 'NON_MATCHING_PASSWORD':
				errorMessage = '"Password" must match "Confirm Password"';
				break;
			case undefined:
				break;

			default:
				exhaustiveCheck(errorType);
		}
	}
</script>

<PageHeader title="Password Reset" />

{#if form?.ok}
	<section class="card w-96 shadow-xl mx-auto border border-primary">
		<div class="card-body">
			<div class="alert alert-success mb-4">
				<CheckmarkIcon />
				<span>Your password has been successfully reset</span>
			</div>
			<form action="/login" method="POST">
				<input type="hidden" name="redirectTo" value="/" />
				<button class="btn btn-primary w-full"> Log In</button>
			</form>
		</div>
	</section>
{:else}
	<section class="card w-96 shadow-xl mx-auto border border-primary">
		<div class="card-body">
			{#if errorMessage}
				<div class="alert alert-error mb-4" transition:fade>
					<ErrorIcon />
					<span>{errorMessage}</span>
				</div>
			{/if}
			<form method="POST" use:enhance>
				<input type="hidden" name="token" value={data.token} />
				<div class="form-control w-full max-w-xs">
					<div class="form-control w-full max-w-xs">
						<label for="email" class="label">
							<span class="label-text">Email</span>
						</label>
						<input
							type="email"
							name="email"
							id="email"
							placeholder="john_doe@unknown.com"
							class="input input-bordered w-full max-w-xs"
							required
						/>
					</div>
					<label for="password" class="label">
						<span class="label-text">New Password</span>
					</label>
					<input
						type="password"
						name="password"
						id="password"
						class="input input-bordered w-full max-w-xs"
						required
					/>
				</div>
				<div class="form-control w-full max-w-xs">
					<label for="confirm-password" class="label">
						<span class="label-text">Confirm New Password</span>
					</label>
					<input
						type="password"
						name="confirm-password"
						id="confirm-password"
						class="input input-bordered w-full max-w-xs"
						required
					/>
				</div>
				<div class="card-actions justify-end mt-8">
					<SubmitButton fullWidth />
				</div>
			</form>
		</div>
	</section>
{/if}
