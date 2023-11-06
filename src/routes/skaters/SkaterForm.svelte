<script lang="ts">
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
			value={firstName}
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
			value={lastName}
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
			<button class="btn btn-outline btn-secondary" type="reset">Reset</button>
			<button class="btn btn-primary" type="submit">Submit</button>
		</slot>
	</div>
</form>
