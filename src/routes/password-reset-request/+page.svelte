<script>
	import { enhance } from '$app/forms';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import SubmitButton from '$lib/components/SubmitButton.svelte';
	import CheckmarkIcon from '$lib/icons/CheckmarkIcon.svelte';

	let { form } = $props();
</script>

<PageHeader title="Password Reset" />

<section class="card w-96 shadow-xl mx-auto border border-primary">
	<div class="card-body">
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
		{#if form?.ok}
			<section class="alert alert-success max-w-prose text-sm max-lg mx-auto mb-4">
				<div class="prose">
					<h3>
						<CheckmarkIcon inline /> Success
					</h3>
					<p>
						An email has been sent to <strong>{form?.value.email}</strong>
						Please check your inbox and follow the instructions to reset your password
					</p>

					<p>
						If you do not receive an email, please verify that the address is correct or contact an
						administrator
					</p>
				</div>
			</section>
		{/if}
	</div>
</section>
