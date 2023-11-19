<script lang="ts">
	import { scale } from 'svelte/transition';

	export let name: string;
	export let options: { label: string; value: string }[];
	export let selectedOptions: { label: string; value: string }[] = [];
	$: unselectionOptions = options.filter(
		(option) => !selectedOptions.some((selectedOption) => option.value === selectedOption.value)
	);
	$: selectedValues = selectedOptions.map((option) => option.value);

	function removeValue(value: string) {
		selectedOptions = selectedOptions.filter((option) => option.value !== value);
	}

	function addOption(option: { label: string; value: string }) {
		selectedOptions.push(option);
		selectedOptions = selectedOptions;
	}
</script>

<div class="form-control w-full max-w-xs input input-bordered h-auto mt-4 pb-2">
	<label class="label" for="skaters">
		<span class="label-text font-bold">Skaters:</span>
	</label>
	<div class="flex gap-2 flex-wrap">
		{#each selectedOptions as { label, value } (value)}
			<button
				type="button"
				transition:scale
				class="btn btn-xs min-w-fit"
				on:click={() => removeValue(value)}
			>
				{label}
			</button>
		{/each}
	</div>
</div>

<div class="form-control w-full max-w-xs input input-bordered h-auto mt-4 pb-2">
	<div class="grid gap-1">
		<label class="label" for="skaters">
			<span class="label-text font-bold">Options:</span>
		</label>
		{#each selectedValues as value}
			<input type="hidden" {name} {value} />
		{/each}
		<ul class="menu p-0 m-0">
			{#each unselectionOptions as { label, value } (value)}
				<li transition:scale class="my-0 px-0">
					<button
						type="button"
						on:click={() => {
							addOption({ label, value });
						}}>{label}</button
					>
				</li>
			{/each}
		</ul>
	</div>
</div>
