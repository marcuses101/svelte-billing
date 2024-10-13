<script lang="ts">
	import CancelIcon from '$lib/icons/CancelIcon.svelte';
	import SearchIcon from '$lib/icons/SearchIcon.svelte';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';

	export let name: string;
	export let optionsLabel = 'Options';
	export let selectedOptionsLabel = 'Selected Options';
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
		.filter((op) => op.label.toLowerCase().includes(search.toLowerCase()))
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

<div class="flex flex-col md:flex-row gap-2 mt-2">
	<div class="w-full max-w-xs border rounded-btn h-auto p-2">
		<div class="grid gap-1">
			<label class="label" for="skaters">
				<span class="label-text font-bold">{optionsLabel}</span>
			</label>
			<label class="input input-sm flex items-center justify-between gap-2 max-w-xs">
				<input
					type="text"
					placeholder="Filter"
					bind:value={search}
					on:blur={() => {
						search = '';
					}}
				/>
				<SearchIcon />
			</label>
			{#each selectedValues as value}
				<input type="hidden" {name} {value} />
			{/each}
			<ul class="menu menu-md menu-vertical flex-nowrap p-0 m-0 h-52 overflow-auto">
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
	<div class="w-full max-w-xs border rounded-btn h-auto p-2">
		<label class="label" for="skaters">
			<span class="label-text font-bold">{selectedOptionsLabel}</span>
		</label>
		<ul class="menu menu-md menu-vertical flex-nowrap p-0 m-0 h-60 overflow-auto">
			{#each selectedOptions as { label, value } (value)}
				<li
					in:receive={{ key: value }}
					out:send={{ key: value }}
					animate:flip={{ duration: 200 }}
					class="my-0 px-0"
				>
					<button
						type="button"
						class="flex justify-between"
						on:click={() => {
							removeValue(value);
						}}>{label}<CancelIcon /></button
					>
				</li>
			{/each}
		</ul>
	</div>
</div>
