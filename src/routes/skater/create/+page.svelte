<script lang="ts">
	import BackButton from '$lib/components/BackButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import type { ActionData } from './$types';
	export let form: ActionData;
	let skaterFullName = form?.skater?.firstName + ' ' + form?.skater?.lastName;
</script>

<section class="max-w-none">
	<PageHeader title="Add a Skater">
		<BackButton href="/skater">Back to Skaters</BackButton>
	</PageHeader>
	{#if form?.success}
		<Toast>New Skater Created - {skaterFullName}</Toast>
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
			/>
		</div>
		<div class="form-control w-full max-w-xs">
			<label for="email" class="label">
				<span class="label-text">Email</span>
			</label>
			<input
				type="textLast Name"
				name="email"
				id="email"
				placeholder="john_doe@unknown.com"
				class="input input-bordered w-full max-w-xs"
			/>
		</div>
		<div class="grid grid-cols-2 gap-2 max-w-xs mt-4">
			<button class="btn btn-outline btn-secondary" type="reset">Reset</button>
			<button class="btn btn-primary" type="submit">Submit</button>
		</div>
	</form>
</section>
