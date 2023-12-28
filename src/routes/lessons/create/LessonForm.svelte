<script lang="ts">
	import MultiSelect from './MultiSelect.svelte';

	type SelectOption = { label: string; value: string };
	export let skaterOptions: SelectOption[] = [];
	export let selectedOptions: SelectOption[] = [];
	export let date: string | undefined = undefined;
	export let minutes: number | undefined = undefined;
</script>

<form
	method="POST"
	on:reset={() => {
		selectedOptions = [];
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
			bind:value={date}
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
			bind:value={minutes}
			step="5"
			min="0"
			name="time-in-minutes"
			placeholder="60"
			class="input input-bordered w-full max-w-xs"
		/>
	</div>
	<MultiSelect name="skaters" options={skaterOptions} {selectedOptions} />
	<div class="grid grid-cols-2 gap-2 max-w-xs mt-4">
		<button class="btn btn-outline btn-secondary" type="reset">Reset</button>
		<button class="btn btn-primary" type="submit">Submit</button>
	</div>
</form>
