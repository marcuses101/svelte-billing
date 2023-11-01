<script lang="ts">
	import BackButton from '$lib/components/BackButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import { onMount } from 'svelte';
	import { scale } from 'svelte/transition';
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
		<BackButton href="/lesson">Back to Lessons</BackButton>
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

		<div class="form-control w-full max-w-xs input input-bordered h-auto mt-4 pb-2">
			{#each skaters as value}
				<input type="hidden" name="skaters" {value} />
			{/each}
			<div class="grid gap-1">
				<label class="label" for="skaters">
					<span class="label-text font-bold">Skaters:</span>
				</label>
				<div class="flex gap-2 flex-wrap">
					{#each selectedSkaters as { label, value } (value)}
						<button
							type="button"
							transition:scale
							class="btn btn-xs min-w-fit"
							on:click={() => removeSkater(value)}
						>
							{label}
						</button>
					{/each}
				</div>
				<ul class="menu p-0 m-0">
					{#each unselectedSkaters as { label, value } (value)}
						<li transition:scale class="my-0 px-0">
							<button
								type="button"
								on:click={() => {
									skaters.push(value);
									skaters = skaters;
								}}>{label}</button
							>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<div class="grid grid-cols-2 gap-2 max-w-xs mt-4">
			<button class="btn btn-outline btn-secondary" type="reset">Reset</button>
			<button class="btn btn-primary" type="submit">Submit</button>
		</div>
	</form>
</section>
