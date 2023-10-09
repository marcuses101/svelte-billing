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

<h1>New Lesson</h1>
{#if form?.success && typeof form.lesson === 'object'}
	<p>{formatLessonAsString(form)}</p>
{/if}
<a href="/lesson">Back to lessons</a>
<form method="POST">
	<section>
		<label for="date"> Date: </label>
		<input id="date" type="date" name="date" bind:this={dateInput} />
		<label for="time-in-minutes"> Lesson Duration (min): </label>
		<input type="number" step="5" min="0" name="time-in-minutes" id="time-in-minutes" />
		<label for="skaters">Skaters:</label>
		<div>
			{#each skaterSelectOptions as { label, value }}
				<label>
					<input type="checkbox" name="skaters" {value} />
					{label}
				</label>
			{/each}
		</div>
	</section>
	<button type="submit">Submit</button>
</form>

<style>
	label {
		display: block;
		margin-block: 1rem;
	}
	section {
		gap: 0.5rem;
		display: grid;
		grid-template-columns: 250px 350px;
	}
</style>
