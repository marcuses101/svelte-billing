<script lang="ts">
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';

	export let name: string;
	export let options: { label: string; value: string }[];
	export let selectedOptions: { label: string; value: string }[] = [];
	let search = '';

	export function reset() {
		search = '';
		selectedOptions = [];
	}

	const [send, receive] = crossfade({
		duration: (d) => Math.sqrt(d * 200),
		easing: quintOut
	});
	$: unselectionOptions = options
		.filter((op) => op.label.toLowerCase().includes(search))
		.filter(
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

<label class="input input-bordered flex items-center gap-2 max-w-xs">
	<input type="text" placeholder="Search" bind:value={search} />
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 16 16"
		fill="currentColor"
		class="h-4 w-4 opacity-70"
	>
		<path
			fill-rule="evenodd"
			d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
			clip-rule="evenodd"
		/>
	</svg>
</label>

<div class="flex flex-row gap-2 mt-2">
	<div class="form-control w-full max-w-xs input input-bordered h-auto pb-2">
		<div class="grid gap-1">
			<label class="label" for="skaters">
				<span class="label-text font-bold">Options:</span>
			</label>
			{#each selectedValues as value}
				<input type="hidden" {name} {value} />
			{/each}
			<ul class="menu p-0 m-0">
				{#each unselectionOptions as { label, value } (value)}
					<li
						in:receive={{ key: value }}
						out:send={{ key: value }}
						animate:flip={{ duration: 200 }}
						class="my-0 px-0"
					>
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
	<div class="form-control w-full max-w-xs input input-bordered h-auto pb-2">
		<label class="label" for="skaters">
			<span class="label-text font-bold">Selected Options:</span>
		</label>
		<ul class="menu p-0 m-0">
			{#each selectedOptions as { label, value } (value)}
				<li
					in:receive={{ key: value }}
					out:send={{ key: value }}
					animate:flip={{ duration: 200 }}
					class="my-0 px-0"
				>
					<button
						type="button"
						on:click={() => {
							removeValue(value);
						}}>{label}</button
					>
				</li>
			{/each}
		</ul>
	</div>
</div>
