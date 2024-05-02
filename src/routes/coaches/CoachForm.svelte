<script lang="ts">
	export let disabled: boolean = false;
	export let firstName: string = '';
	export let lastName: string = '';
	export let email: string = '';
	export let hourlyRateInCents: number | undefined = undefined;
	export let commissionPercentage: number = 0;
	export let showReset: boolean = true;
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
		<label for="permission-percentage" class="label">
			<span class="label-text">Hourly Rate (in cents)</span>
		</label>
		<input
			{disabled}
			value={commissionPercentage}
			type="number"
			name="permission-percentage"
			id="hourly-rate"
			min="0"
			class="input input-bordered w-full max-w-xs"
			required
		/>
	</div>
	<div class="form-control w-full max-w-xs">
		<label for="hourly-rate" class="label">
			<span class="label-text">Hourly Rate (in cents)</span>
		</label>
		<input
			{disabled}
			value={hourlyRateInCents}
			type="number"
			name="hourly-rate"
			id="hourly-rate"
			min="0"
			class="input input-bordered w-full max-w-xs"
			required
		/>
	</div>
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
