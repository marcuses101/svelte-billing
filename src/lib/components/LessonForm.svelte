<script lang="ts">
	import { format } from 'date-fns';
	import MultiSelect from './MultiSelect.svelte';
	import { enhance } from '$app/forms';
	import { successToast } from './toaster.svelte';
	type SelectOption = { label: string; value: string };

	const defaultDate = format(new Date(), 'yyyy-MM-dd');
	const defaultMinutes = 15;

	interface Props {
		mode?: 'Add' | 'Edit';
		skaterOptions?: SelectOption[];
		selectedOptions?: SelectOption[];
		date?: string;
		minutes?: number;
	}

	let {
		mode = 'Add',
		skaterOptions = [],
		selectedOptions = [],
		date = $bindable(defaultDate),
		minutes = $bindable(defaultMinutes)
	}: Props = $props();
	let multiselectComponent: ReturnType<typeof MultiSelect> | undefined = $state();

	let formatMinutes = new Intl.NumberFormat('en-CA', { style: 'unit', unit: 'minute' }).format;
	function addMinutes(time: number) {
		minutes += time;
	}
	function subtractMinutes(time: number) {
		minutes = Math.max(0, minutes - time);
	}
</script>

<form
	method="POST"
	onreset={(e) => {
		e.preventDefault();
		multiselectComponent?.reset();
		minutes = defaultMinutes;
		date = defaultDate;
	}}
	action={mode === 'Edit' ? '?/edit' : undefined}
	use:enhance={() => {
		return async ({ result, update }) => {
			if (result.type === 'success') {
				const message = mode === 'Add' ? 'Lesson Created' : 'Lesson Updated';
				successToast(message);
			}
			if (result.type === 'redirect') {
				successToast('Lesson Removed');
			}
			await update({ reset: mode === 'Add' });
		};
	}}
>
	<div class="form-control w-full max-w-xs">
		<label class="label" for="date">
			<span class="label-text">Lesson Date</span>
		</label>
		<input
			id="date"
			type="date"
			name="date"
			required
			bind:value={date}
			placeholder="Type here"
			class="input input-bordered w-full max-w-xs"
		/>
	</div>

	<div class="form-control w-full max-w-xs mb-4">
		<label class="label" for="time-in-minutes">
			<span class="label-text">Lesson time</span>
		</label>
		<input id="time-in-minutes" type="hidden" value={minutes} name="time-in-minutes" />
		<div class="flex flex-row gap-2 items-center">
			<button
				type="button"
				class="btn"
				onclick={() => {
					subtractMinutes(15);
				}}>-15</button
			>
			<button
				type="button"
				class="btn"
				onclick={() => {
					subtractMinutes(5);
				}}>-5</button
			>
			<span class="text-xl font-bold">{formatMinutes(minutes ?? 0)}</span>
			<button
				type="button"
				class="btn"
				onclick={() => {
					addMinutes(5);
				}}>+5</button
			>
			<button
				type="button"
				class="btn"
				onclick={() => {
					addMinutes(15);
				}}>+15</button
			>
		</div>
	</div>
	<MultiSelect
		bind:this={multiselectComponent}
		optionsLabel="Skaters"
		selectedOptionsLabel="Selected Skaters"
		name="skaters"
		options={skaterOptions}
		{selectedOptions}
	/>
	<div class="grid grid-cols-2 gap-2 max-w-xs mt-4">
		{#if mode === 'Edit'}
			<button class="btn btn-error" type="submit" formaction="?/delete">Delete</button>
		{:else}
			<button class="btn btn-outline btn-secondary" type="reset">Reset</button>
		{/if}
		<button class="btn btn-primary" type="submit">Submit</button>
	</div>
</form>
