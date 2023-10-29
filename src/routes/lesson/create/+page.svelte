<script lang="ts">
	import BackButton from '$lib/components/BackButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { onMount } from 'svelte';

	export let data;
	export let form;
	let dateInput: HTMLInputElement;
	let skaterSelectOptions = data.skaters.map(({ id, firstName, lastName }) => ({
		value: id,
		label: `${firstName} ${lastName}`
	}));

	onMount(() => {
		dateInput.valueAsDate = new Date();
	});

	function formatLessonAsString(formData: typeof form): string {
		if (formData === null || typeof formData.lesson !== 'object') return '';
		const formatDate = new Intl.DateTimeFormat('en-CA', { dateStyle: 'long' }).format;
		const skaters = formData.lesson.skaters
			.map((skater) => {
				return `${skater.Skater.firstName} ${skater.Skater.lastName}`;
			})
			.join(',');
		return `${formatDate(formData.lesson.date)}; ${
			formData.lesson.lessonTimeInMinutes
		}min; ${skaters}`;
	}
</script>

<section class="prose container max-w-none">
	<PageHeader title="New Lesson">
		<BackButton href="/lesson">Back to Lessons</BackButton>
	</PageHeader>
	{#if form?.success && typeof form.lesson === 'object'}
		<p>{formatLessonAsString(form)}</p>
	{/if}
	<form method="POST">
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
			<div class="grid gap-1">
				<label class="label" for="skaters"><span class="label-text font-bold">Skaters:</span></label
				>
				{#each skaterSelectOptions as { label, value }}
					<div class="form-control">
						<label class="flex justify-between cursor-pointer">
							<span class="label-text">{label}</span>
							<input type="checkbox" class="checkbox" name="skaters" {value} />
						</label>
					</div>
				{/each}
			</div>
		</div>
		<div class="grid grid-cols-2 gap-2 max-w-xs mt-4">
			<button class="btn btn-outline btn-secondary" type="reset">Reset</button>
			<button class="btn btn-primary" type="submit">Submit</button>
		</div>
	</form>
</section>
