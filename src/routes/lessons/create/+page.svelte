<script lang="ts">
	import BackButton from '$lib/components/BackButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import { onMount } from 'svelte';
	import { scale } from 'svelte/transition';
	import MultiSelect from './MultiSelect.svelte';
	export let data;
	export let form;
	let dateInput: HTMLInputElement;
	type Option = { label: string; value: string };

	onMount(() => {
		dateInput.valueAsDate = new Date();
	});

	const skaterSelectOptions = data.skaters.map(({ id, firstName, lastName }) => ({
		value: id,
		label: `${firstName} ${lastName}`
	}));

	let skaters: string[] = [];

	function removeSkater(idToRemove: string) {
		skaters = skaters.filter((id) => id !== idToRemove);
	}
	$: selectedSkaters = skaters
		.map((id) => skaterSelectOptions.find(({ value }) => value === id))
		.filter((option): option is Option => Boolean(option));
	$: unselectedSkaters = skaterSelectOptions.filter(({ value }) => !skaters.includes(value));
</script>

<section class="prose container max-w-none">
	<PageHeader title="New Lesson">
		<BackButton href="/lessons">Back to Lessons</BackButton>
	</PageHeader>
	{#if form?.success && form?.lessonTimeInMinutes}
		<Toast>
			{form?.lessonTimeInMinutes} minute lesson logged
		</Toast>
	{/if}
	<form
		method="POST"
		on:reset={() => {
			skaters = [];
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
				bind:this={dateInput}
				placeholder="Type here"
				class="input input-bordered w-full max-w-xs"
			/>
		</div>
		<div class="form-control w-full max-w-xs">
			<label class="label" for="time-in-minutes">
				<span class="label-text">Lesson minutes</span>
			</label>
			<input
				id="time-in-minutes"
				type="number"
				step="5"
				min="0"
				name="time-in-minutes"
				placeholder="60"
				class="input input-bordered w-full max-w-xs"
			/>
		</div>
		<MultiSelect name="skaters" options={skaterSelectOptions} />
		<div class="grid grid-cols-2 gap-2 max-w-xs mt-4">
			<button class="btn btn-outline btn-secondary" type="reset">Reset</button>
			<button class="btn btn-primary" type="submit">Submit</button>
		</div>
	</form>
</section>
