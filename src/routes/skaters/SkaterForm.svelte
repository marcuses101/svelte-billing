<script lang="ts">
	export let disabled: boolean = false;
	export let firstName = '';
	export let lastName = '';
	export let email = '';
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
		/>
	</div>
	<div class="grid grid-cols-2 gap-2 max-w-xs mt-4">
		<slot name="buttons">
			{#if !disabled}
				<button class="btn btn-outline btn-secondary" type="reset">Reset</button>
				<button class="btn btn-primary" type="submit">Submit</button>
			{/if}
		</slot>
	</div>
</form>
