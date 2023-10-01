<script lang="ts">
	export let data;
	let skaterSelectOptions = data.skaters.map(({ id, firstName, lastName }) => ({
		value: id,
		label: `${firstName} ${lastName}`
	}));
</script>

<h1>New Lesson</h1>
<form method="POST">
	<input type="date" name="date" />
	<input type="number" step="5" min="0" name="time-in-minutes" />
	<select name="skater" multiple>
		{#each skaterSelectOptions as { label, value }}
			<option {value}> {label}</option>
		{/each}
	</select>
	<button type="submit">Submit</button>
</form>
