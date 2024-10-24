<script>
	/**
	 * @typedef {Object} Props
	 * @property {boolean} [inline]
	 */

	/** @type {Props} */
	let { inline = false } = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	class="h-6 w-6 shrink-0 stroke-current"
	class:inline
	fill="none"
	viewBox="0 0 24 24"
>
	<path
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width="2"
		d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
	/>
</svg>
