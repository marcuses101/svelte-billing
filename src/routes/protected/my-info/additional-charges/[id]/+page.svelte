<script lang="ts">
	import CurrencyInput from '$lib/components/CurrencyInput.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import SubmitButton from '$lib/components/SubmitButton.svelte';
	import BackButton from '$lib/components/BackButton.svelte';

	let { data } = $props();
	let {
		skaterInvoiceMiscellaneousItem: { date, description, amountInCents, skaterId },
		skaterOptions
	} = $derived(data);
</script>

<PageHeader title="Additional Charges">
	<BackButton href="/protected/my-info/additional-charges" />
</PageHeader>

<form method="POST" id="update" action="?/update" class="flex flex-wrap gap-4 items-end mb-4">
	<input type="hidden" name="transaction-type" value="credit" />
	<div class="form-control w-full max-w-xs">
		<label class="label" for="date">
			<span class="label-text">Charge Date</span>
		</label>
		<input
			id="date"
			type="date"
			name="date"
			required
			value={date.toISOString().split('T')[0]}
			placeholder="Type here"
			class="input input-bordered w-full max-w-xs"
		/>
	</div>
	<label class="form-control w-full max-w-xs">
		<div class="label">
			<span class="label-text">Skater</span>
		</div>
		<select class="select select-bordered" name="skater-id" value={skaterId} required>
			{#each skaterOptions as { label, value }}
				<option {value}>{label}</option>
			{/each}
		</select>
	</label>
	<div class="form-control w-full max-w-xs">
		<label class="label" for="description">
			<span class="label-text">Description</span>
		</label>
		<input
			id="description"
			type="text"
			name="description"
			required
			value={description}
			placeholder="Example: Competition fees"
			class="input input-bordered w-full max-w-xs"
		/>
	</div>
	<CurrencyInput name="amount-in-cents" label="Amount" value={amountInCents} />
</form>
<div class="flex flex-row gap-2">
	<form method="POST" action="?/delete">
		<button class="btn btn-error" type="submit">Delete</button>
	</form>
	<SubmitButton form="update" />
</div>
