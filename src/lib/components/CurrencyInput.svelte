<script lang="ts">
	import { formatCurrency } from '$lib/formatCurrency';
	import type { ChangeEventHandler } from 'svelte/elements';

	/**
    TODO:
    - [ ] implement required that prevents submit if 0;
    */

	export let value: number = 0;
	export let label: string | undefined = undefined;
	export let name: string;
	export let disabled: boolean = false;

	let visibleName = `_${name}-visible`;

	const numberRegex = /[0-9]/;

	const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		const newValue = e.currentTarget.value;
		const stripped = newValue
			.split('')
			.filter((char: string) => {
				// 				debugger;
				return numberRegex.test(char);
			})
			.join('');
		value = parseInt(stripped);
		if (Number.isNaN(value)) {
			value = 1;
			value = 0;
		}
	};
	$: currencyVisibleValue = formatCurrency(value);
</script>

<div class="form-control w-full max-w-xs">
	{#if label}
		<label for="currency" class="label">
			<span class="label-text">{label}</span>
		</label>
	{/if}
	<input {disabled} type="hidden" {name} {value} />
	<input
		type="text"
		{disabled}
		on:keydown={(e) => {
			const isNumber = numberRegex.test(e.key);
			if (isNumber) {
				return;
			}
			const isBackspace = e.key === 'Backspace';
			if (isBackspace) {
				return;
			}
			const isTab = e.key === 'Tab';
			if (isTab) {
				return;
			}

			e.preventDefault();
		}}
		on:focus={(e) => {
			e.currentTarget.setSelectionRange(999, 999);
		}}
		on:click={(e) => {
			e.currentTarget.setSelectionRange(999, 999);
		}}
		on:input|preventDefault={handleChange}
		on:change|preventDefault={handleChange}
		value={currencyVisibleValue}
		name={visibleName}
		id="currency"
		min="0"
		class="input input-bordered w-full max-w-xs"
		required
	/>
</div>
