<script lang="ts">
	import CurrencyInput from '$lib/components/CurrencyInput.svelte';
	import { SKATER_TYPE, type SkaterType } from '$lib/defs';
	const skaterTypeRateIds = Object.values(SKATER_TYPE).map((type) => ({
		skaterTypeCode: type,
		id: `hourly-rate-${type}`,
		label: `Hourly Rate ${type}`
	}));
	interface Props {
		disabled?: boolean;
		firstName?: string;
		lastName?: string;
		email?: string;
		commissionPercentage?: number;
		rates?: Record<SkaterType, number>;
		isHstCharged?: boolean;
		children?: import('svelte').Snippet;
	}

	let {
		disabled = false,
		firstName = '',
		lastName = '',
		email = '',
		commissionPercentage = 0,
		rates = {
			RESIDENT: 60_00,
			US: 60_00,
			INTERNATIONAL: 60_00
		},
		isHstCharged = $bindable(false),
		children
	}: Props = $props();
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
	<div class="form-control w-full max-w-xs">
		<label class="label cursor-pointer">
			<span class="label-text">Charges HST</span>
			<input
				{disabled}
				type="checkbox"
				value="true"
				name="is-hst-charged"
				bind:checked={isHstCharged}
				class="checkbox"
			/>
		</label>
	</div>
	{#each skaterTypeRateIds as { id, label, skaterTypeCode }}
		<CurrencyInput {disabled} {label} name={id} value={rates[skaterTypeCode]} />
	{/each}
	<div class="flex flex-row justify-end mt-4 max-w-xs">
		{@render children?.()}
	</div>
</form>
