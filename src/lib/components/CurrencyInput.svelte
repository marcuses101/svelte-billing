<script lang="ts">
	import { formatCurrency } from '$lib/formatCurrency';
	import type { ChangeEventHandler } from 'svelte/elements';

	interface Props {
		/**
    TODO:
    - [ ] implement required that prevents submit if 0;
    */
		value?: number;
		label?: string | undefined;
		name: string;
		disabled?: boolean;
	}

	let { value = $bindable(0), label = undefined, name, disabled = false }: Props = $props();

	let visibleName = `_${name}-visible`;

	const numberRegex = /[0-9]/;

	const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		e.preventDefault();
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
	let currencyVisibleValue = $derived(formatCurrency(value));
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
		onkeydown={(e) => {
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
		onfocus={(e) => {
			e.currentTarget.setSelectionRange(999, 999);
		}}
		onmousedown={(e) => {
			e.preventDefault();
			e.currentTarget.focus();
			e.currentTarget.setSelectionRange(999, 999);
		}}
		onclick={(e) => {
			e.currentTarget.setSelectionRange(999, 999);
		}}
		oninput={handleChange}
		onchange={handleChange}
		value={currencyVisibleValue}
		name={visibleName}
		id="currency"
		min="0"
		class="input input-bordered w-full max-w-xs text-right"
		required
	/>
</div>
