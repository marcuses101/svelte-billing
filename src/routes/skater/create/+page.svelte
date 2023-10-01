<script lang="ts">
	import type { ActionData } from './$types';
	export let form: ActionData;
	let skaterFullName = form?.skater?.firstName + ' ' + form?.skater?.lastName;
</script>

<h1>Add a new skater</h1>
{#if form?.success}
	<p>New Skater Created - {skaterFullName}</p>
{/if}
<form method="POST">
	<label
		>First Name
		<input name="first-name" id="first-name" type="text" />
	</label>
	<label
		>Last Name
		<input name="last-name" id="last-name" type="text" />
	</label>
	<button type="submit">Submit</button>
</form>
