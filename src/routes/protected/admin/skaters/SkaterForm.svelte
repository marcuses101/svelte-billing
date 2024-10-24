<script lang="ts">
	import SubmitButton from '$lib/components/SubmitButton.svelte';
	import { SKATER_TYPE, type SkaterType } from '$lib/defs';

	interface Props {
		disabled?: boolean;
		firstName?: string;
		lastName?: string;
		skaterTypeCode?: SkaterType;
		buttons?: import('svelte').Snippet;
	}

	let {
		disabled = false,
		firstName = '',
		lastName = '',
		skaterTypeCode = $bindable('RESIDENT'),
		buttons
	}: Props = $props();
	const types = Object.values(SKATER_TYPE);
</script>

<form method="POST">
	<div class="form-control w-full max-w-xs">
		<label for="first-name" class="label">
			<span class="label-text">First Name</span>
		</label>
		<input
			{disabled}
			required
			maxlength="35"
			value={firstName}
			type="text"
			name="first-name"
			autocomplete="given-name"
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
			{disabled}
			value={lastName}
			required
			maxlength="35"
			type="text"
			name="last-name"
			autocomplete="family-name"
			id="last-name"
			placeholder="Doe"
			class="input input-bordered w-full max-w-xs"
		/>
	</div>
	<label class="form-control w-full max-w-xs">
		<div class="label">
			<span class="label-text">Skater Type</span>
		</div>
		<select
			name="skater-type-code"
			{disabled}
			bind:value={skaterTypeCode}
			class="select select-bordered w-full max-w-xs"
		>
			{#each types as type}
				<option selected={type === skaterTypeCode} value={type}>{type}</option>
			{/each}
		</select>
	</label>
	<div class="grid grid-cols-2 gap-2 max-w-xs mt-4">
		{#if buttons}{@render buttons()}{:else}
			{#if !disabled}
				<button class="btn btn-outline btn-secondary" type="reset">Reset</button>
				<SubmitButton />
			{/if}
		{/if}
	</div>
</form>
