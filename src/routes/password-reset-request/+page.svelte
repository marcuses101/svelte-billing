<script>
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import SubmitButton from '$lib/components/SubmitButton.svelte';
	import CheckmarkIcon from '$lib/icons/CheckmarkIcon.svelte';
	import InfoIcon from '$lib/icons/InfoIcon.svelte';

	export let form;
</script>

<PageHeader title="Password Reset" />

{#if form?.ok}
	<section class="alert alert-success max-w-prose text-sm max-lg mx-auto mb-4">
		<CheckmarkIcon />
		<div>
			<h3 class="font-bold">Success</h3>
			<div class="text-xs">
				If an account with the email<strong>{' ' + form?.email}</strong>
				exists, a password reset link has been sent to that address. Please check your inbox and follow
				the instructions to reset your password.<br />

				If you do not receive an email, please verify that the address is correct or contact an
				administrator
			</div>
		</div>
	</section>
{/if}

<section class="card w-96 shadow-xl mx-auto border border-primary">
	<div class="card-body">
		{#if $page.url.searchParams.get('required') === 'true' && !form?.ok}
			<section class="alert alert-info">
				<InfoIcon />
				<p>
					Your account has been flagged for a forced password reset. Please enter your email below
				</p>
			</section>
		{/if}
		<form method="POST" use:enhance>
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
			<div class="card-actions justify-end mt-8">
				<SubmitButton fullWidth />
			</div>
		</form>
	</div>
</section>
