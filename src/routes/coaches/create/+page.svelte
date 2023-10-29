<script lang="ts">
	import { onMount } from 'svelte';
	import type { ActionData } from './$types';
	import { fade, scale } from 'svelte/transition';
	export let form: ActionData;
	let coachFullName = form?.coach?.firstName + ' ' + form?.coach?.lastName;
	let toastVisible = true;
	onMount(() => {
		setTimeout(() => {
			toastVisible = false;
		}, 3000);
	});
</script>

<section class="prose container max-w-none">
	<h1>Add a new Coach</h1>
	{#if toastVisible}
		<div transition:scale class="toast toast-center">
			<div class="alert alert-success">
				<span>New Coach Created - {coachFullName}</span>
			</div>
		</div>
	{/if}
	<form method="POST">
		<div class="form-control w-full max-w-xs">
			<label for="first-name" class="label">
				<span class="label-text">First Name</span>
			</label>
			<input
				type="text"
				name="first-name"
				id="first-name"
				placeholder="John"
				class="input input-bordered w-full max-w-xs"
				required
			/>
		</div>
		<div class="form-control w-full max-w-xs">
			<label for="last-name" class="label">
				<span class="label-text">Last Name</span>
			</label>
			<input
				type="text"
				name="last-name"
				id="last-name"
				placeholder="Doe"
				class="input input-bordered w-full max-w-xs"
				required
			/>
		</div>
		<div class="form-control w-full max-w-xs">
			<label for="email" class="label">
				<span class="label-text">Email</span>
			</label>
			<input
				type="text"
				name="email"
				id="email"
				placeholder="john_doe@unknown.com"
				class="input input-bordered w-full max-w-xs"
				required
			/>
		</div>
		<div class="form-control w-full max-w-xs">
			<label for="hourly-rate" class="label">
				<span class="label-text">Hourly Rate (in cents)</span>
			</label>
			<input
				type="number"
				name="hourly-rate"
				id="hourly-rate"
				min="0"
				class="input input-bordered w-full max-w-xs"
				required
			/>
		</div>
		<div class="grid grid-cols-2 gap-2 max-w-xs mt-4">
			<button class="btn btn-outline btn-secondary" type="reset">Reset</button>
			<button class="btn btn-primary" type="submit">Submit</button>
		</div>
	</form>
</section>
