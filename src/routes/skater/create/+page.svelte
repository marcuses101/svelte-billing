<script lang="ts">
	import type { ActionData } from './$types';
	export let form: ActionData;
	let skaterFullName = form?.skater?.firstName + ' ' + form?.skater?.lastName;
</script>

<section class="prose container mx-auto">
	<h1>Add a new skater</h1>
	{#if form?.success}
		<div class="toast toast-center">
			<div class="alert alert-success">
				<span>New Skater Created - {skaterFullName}</span>
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
		<button class="btn mt-4" type="submit">Submit</button>
	</form>
</section>
