<script lang="ts">
	import { page } from '$app/stores';
	import { INVALID_EMAIL_OR_PASSWORD_CODE, PASSWORD_RESET_CODE } from '$lib/defs';
	import SubmitButton from '$lib/components/SubmitButton.svelte';
	import ErrorIcon from '$lib/icons/ErrorIcon.svelte';
	import { fade } from 'svelte/transition';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import InfoIcon from '$lib/icons/InfoIcon.svelte';

	export let data;
	const user = data.user;
</script>

{#if Boolean(user)}
	<PageHeader title={`Logged in as ${user.firstName} ${user.lastName}`} />
	<section class="card w-96 shadow-xl mx-auto border border-primary">
		<div class="card-body">
			<form action="/logout" method="POST">
				<input type="hidden" name="redirectTo" value="/" />
				<button type="submit" class="btn btn-primary w-full">Log Out</button>
			</form>
		</div>
	</section>
{:else}
	<PageHeader title="Login" />
	<section class="card w-96 shadow-xl mx-auto border border-primary">
		<div class="card-body">
			<form method="POST" action="/auth/callback/credentials">
				<input type="hidden" name="callbackUrl" value={$page.url.searchParams.get('callbackUrl')} />
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
						<span class="label-text">Password</span>
					</label>
					<input
						type="password"
						name="password"
						id="password"
						class="input input-bordered w-full max-w-xs"
						required
					/>
				</div>

				{#if $page.url.searchParams.get('code') === INVALID_EMAIL_OR_PASSWORD_CODE}
					<div class="alert alert-error mt-2" transition:fade>
						<ErrorIcon />
						<span>Invalid email or password</span>
					</div>
				{:else if $page.url.searchParams.get('code') === PASSWORD_RESET_CODE}
					<section class="alert alert-info mt-8" transition:fade>
						<InfoIcon />
						<p>
							Your account has been flagged for a forced password reset. Please request a password
							reset by clicking on the link below
						</p>
					</section>
				{/if}
				<div class="card-actions justify-end mt-8">
					<SubmitButton fullWidth />
				</div>
			</form>
			<p class="mx-auto">
				<a href="/password-reset-request" class="link link-info">Request Password Reset</a>
			</p>
		</div>
	</section>
{/if}
