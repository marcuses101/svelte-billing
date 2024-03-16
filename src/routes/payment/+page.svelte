<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	let selectedSkaterId: null | string = null;
	export let data;
	const options = data.skaters.map(({ id, firstName, lastName }) => ({
		label: `${firstName} ${lastName}`,
		value: id
	}));
</script>

<PageHeader title="Skater Payments Recieved" />

<form class="flex flex-row items-end gap-2">
	<select
		name="skater-id"
		bind:value={selectedSkaterId}
		id="skater-id"
		class="select select-bordered w-full max-w-xs"
		required
	>
		<option disabled selected value={null}>Skater Name</option>
		{#each options as { label, value }}
			<option {value}>{label}</option>
		{/each}
	</select>
	<label for="amount" class="input input-bordered flex items-center gap-2">
		Amount $:
		<input type="number" min="0" step="0.01" name="amount" id="amount" class="grow" required />
	</label>
	<button type="submit" class="btn btn-primary">Add Payment</button>
</form>
