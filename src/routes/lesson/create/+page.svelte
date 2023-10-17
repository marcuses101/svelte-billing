<script lang="ts">
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

<section class="prose container mx-auto">
	<div class="flex justify-between">
		<h1>New Lesson</h1>
		<a class="btn" href="/lesson">Back to lessons</a>
	</div>
	{#if form?.success && typeof form.lesson === 'object'}
		<p>{formatLessonAsString(form)}</p>
	{/if}
	<form method="POST">
		<section>
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
			<div class="form-control w-full max-w-xs border rounded border-black">
				<label class="label" for="skaters"><span class="label-text">Skaters:</span></label>
				<div>
					{#each skaterSelectOptions as { label, value }}
						<div class="form-control">
							<label class="label cursor-pointer">
								<span class="label-text">{label}</span>
								<input type="checkbox" class="checkbox" name="skaters" {value} />
							</label>
						</div>
					{/each}
				</div>
			</div>
		</section>
		<button class="btn" type="submit">Submit</button>
	</form>
</section>
