<script lang="ts">
	import { SKATER_TYPE, type SkaterType } from '$lib/defs';
	const skaterTypeRateIds = Object.values(SKATER_TYPE).map((type) => ({
		skaterTypeCode: type,
		id: `hourly-rate-${type}`,
		label: `Hourly Rate ${type}`
	}));
	export let disabled: boolean = false;
	export let firstName: string = '';
	export let lastName: string = '';
	export let email: string = '';
	export let commissionPercentage: number = 0;
	export let showReset: boolean = true;
	export let rates: Record<SkaterType, number> = {
		RESIDENT: 60_00,
		US: 60_00,
		INTERNATIONAL: 60_00
	};
</script>

<form method="POST">
	<div class="form-control w-full max-w-xs">
		<label for="first-name" class="label">
			<span class="label-text">First Name</span>
		</label>
		<input
			{disabled}
			value={firstName}
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
			{disabled}
			value={lastName}
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
			{disabled}
			value={email}
			type="email"
			name="email"
			id="email"
			placeholder="john_doe@unknown.com"
			class="input input-bordered w-full max-w-xs"
			required
		/>
	</div>
	<div class="form-control w-full max-w-xs">
		<label for="commission-percentage" class="label">
			<span class="label-text">Commission Percentage</span>
		</label>
		<input
			{disabled}
			value={commissionPercentage}
			type="number"
			name="commission-percentage"
			id="commission-percentage"
			min="0"
			class="input input-bordered w-full max-w-xs"
			required
		/>
	</div>
	{#each skaterTypeRateIds as { id, label, skaterTypeCode }}
		<div class="form-control w-full max-w-xs">
			<label for={id} class="label">
				<span class="label-text">{label}</span>
			</label>
			<input
				{disabled}
				bind:value={rates[skaterTypeCode]}
				type="number"
				name={id}
				{id}
				min="0"
				class="input input-bordered w-full max-w-xs"
				required
			/>
		</div>
	{/each}
	{#if !disabled}
		<div class="grid grid-cols-2 gap-2 max-w-xs mt-4">
			{#if showReset}
				<button class="btn btn-outline btn-secondary" type="reset">Reset</button>
			{:else}
				<div />
			{/if}
			<button class="btn btn-primary" type="submit">Submit</button>
		</div>
	{/if}
</form>
