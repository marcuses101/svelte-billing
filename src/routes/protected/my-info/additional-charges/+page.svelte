<script lang="ts">
	import { enhance } from '$app/forms';
	import CancelButton from '$lib/components/CancelButton.svelte';
	import CurrencyInput from '$lib/components/CurrencyInput.svelte';
	import EditButton from '$lib/components/EditButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import StyledTable from '$lib/components/StyledTable.svelte';
	import SubmitButton from '$lib/components/SubmitButton.svelte';
	import { formatCurrency } from '$lib/formatCurrency';
	import { formatDate } from '$lib/formatDate.js';

	export let data;

	let editId: string | null = null;
</script>

<PageHeader title="Additional Charges" />

<form use:enhance method="POST" class="flex flex-wrap gap-4 items-end">
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
			placeholder="Type here"
			class="input input-bordered w-full max-w-xs"
		/>
	</div>
	<label class="form-control w-full max-w-xs">
		<div class="label">
			<span class="label-text">Skater</span>
		</div>
		<select class="select select-bordered" name="skater-id" required>
			<option disabled selected>Select a skater</option>
			{#each data.skaterOptions as { label, value }}
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
			placeholder="Example: Competition fees"
			class="input input-bordered w-full max-w-xs"
		/>
	</div>
	<CurrencyInput name="amount-in-cents" label="Amount" />
	<SubmitButton />
</form>

<StyledTable class="mt-8">
	<tr slot="head">
		<th>Date</th>
		<th>Skater</th>
		<th>Description</th>
		<th>Amount</th>
		<th />
	</tr>
	{#each data.skaterInvoiceMiscellaneousItems as { id, date, amountInCents, description, Skater: { firstName, lastName } }}
		<tr>
			<td>{formatDate(date)}</td>
			<td>{firstName} {lastName}</td>
			<td>{description}</td>
			<td>{formatCurrency(amountInCents)}</td>
			<td>
				{#if id === editId}
					<CancelButton
						size="sm"
						on:click={() => {
							editId = null;
						}}
					/>
				{:else}
					<EditButton
						size="sm"
						on:click={() => {
							editId = id;
						}}
					/>
				{/if}
			</td>
		</tr>
	{:else}
		<tr>
			<td>No charges found for this billing period</td>
		</tr>
	{/each}
</StyledTable>
