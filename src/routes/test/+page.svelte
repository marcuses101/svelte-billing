<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { formatCurrency } from '$lib/formatCurrency';
	import type { ChangeEventHandler } from 'svelte/elements';

	const numberRegex = /[0-9]/;
	let currencyVisibleValue = formatCurrency(0);
	let currencyValue: number = 0;

	const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		currencyVisibleValue = 'abc123'; // this is a hack for prevent unwanted characters from showing up
		const value = e.currentTarget.value;
		const stripped = value
			.split('')
			.filter((char) => {
				// 				debugger;
				return numberRegex.test(char);
			})
			.join('');
		if (stripped.length === 0) {
			currencyVisibleValue = formatCurrency(0);
			return;
		}
		const formattedValue = formatCurrency(parseInt(stripped));
		currencyVisibleValue = formattedValue;
		currencyValue = parseInt(stripped);
		console.log({ currencyValue, currencyVisibleValue });
	};
	let test = '3';
</script>

<PageHeader title="Test Page" />

<form
	on:submit|preventDefault={(e) => {
		const formData = new FormData(e.currentTarget);

		console.log(formData.get('currency'));
	}}
>
	<div class="form-control w-full max-w-xs">
		<label for="currency" class="label">
			<span class="label-text">Hourly Rate</span>
		</label>
		<div>{currencyVisibleValue}</div>
		<input
			type="text"
			value={test}
			on:input={(e) => {
				test = '3';
			}}
		/>
		<input type="hidden" name="currency" value={currencyValue} />
		<input
			type="text"
			on:input|preventDefault={handleChange}
			on:change|preventDefault={handleChange}
			value={currencyVisibleValue}
			name="currency_visible"
			id="currency"
			min="0"
			class="input input-bordered w-full max-w-xs"
			required
		/>
		<button type="submit">Submit</button>
	</div>
</form>
