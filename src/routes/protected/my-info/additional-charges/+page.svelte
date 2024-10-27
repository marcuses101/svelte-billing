<script lang="ts">
	import { enhance } from '$app/forms';
	import CurrencyInput from '$lib/components/CurrencyInput.svelte';
	import EditButton from '$lib/components/EditButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import StyledTable from '$lib/components/StyledTable.svelte';
	import SubmitButton from '$lib/components/SubmitButton.svelte';
	import { errorToast, successToast } from '$lib/components/toaster.svelte';
	import { formatCurrency } from '$lib/formatCurrency';
	import { formatDate } from '$lib/formatDate.js';

	let { data } = $props();

	const rows = $derived.by(() => {
		const items = data.coachPaySlipMiscellaneousItem;
		const rowsFiltered = items
			.filter(({ skaterInvoiceMiscellaneousItem }) => {
				return skaterInvoiceMiscellaneousItem && skaterInvoiceMiscellaneousItem.Skater;
			})
			.map((item) => ({
				id: item.id,
				dateFormatted: formatDate(item.date),
				amountFormatted: formatCurrency(item.amountInCents),
				description: item.description,
				skaterName: `${item.skaterInvoiceMiscellaneousItem?.Skater.firstName} ${item?.skaterInvoiceMiscellaneousItem?.Skater.lastName}`
			}));
		return rowsFiltered;
	});
</script>

<PageHeader title="Additional Charges" />

<form
	use:enhance={() => {
		return async ({ result, update }) => {
			if (result.type === 'success') {
				successToast('New Item Added!');
			} else {
				errorToast('Something went wrong');
			}
			await update();
		};
	}}
	method="POST"
	class="shadow-lg p-2 rounded-xl border border-primary"
>
	<div class="flex flex-wrap gap-x-4 items-end justify-between">
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
				class="input input-bordered w-full max-w-xs input-sm"
			/>
		</div>
		<label class="form-control w-full max-w-xs">
			<div class="label">
				<span class="label-text">Skater</span>
			</div>
			<select class="select select-bordered select-sm" name="skater-id" required>
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
				class="input input-bordered w-full max-w-xs input-sm"
			/>
		</div>
		<CurrencyInput name="amount-in-cents" label="Amount" size="sm" />
	</div>
	<div class="flex mt-2 justify-end">
		<SubmitButton />
	</div>
</form>

<StyledTable class="mt-8">
	{#snippet head()}
		<tr>
			<th>Date</th>
			<th>Skater</th>
			<th>Description</th>
			<th>Amount</th>
			<th></th>
		</tr>
	{/snippet}
	{#each rows as { id, description, amountFormatted, dateFormatted, skaterName } (id)}
		<tr class:updated-row={data.updatedId === id} class:created-row={data.createdId === id}>
			<td>{dateFormatted}</td>
			<td>{skaterName}</td>
			<td>{description}</td>
			<td>{amountFormatted}</td>
			<td>
				<EditButton size="sm" href={`/protected/my-info/additional-charges/${id}`} />
			</td>
		</tr>
	{:else}
		<tr>
			<td>No charges found for this billing period</td>
		</tr>
	{/each}
</StyledTable>

<style>
	@keyframes highlight {
		0% {
			background-color: var(--hl-colour);
		}
		100% {
			background-color: transparent;
		}
	}

	.updated-row {
		animation: highlight 2s ease-out;
		--hl-colour: theme('colors.warning');
	}
	.created-row {
		animation: highlight 2s ease-out;
		--hl-colour: theme('colors.success');
	}
</style>
