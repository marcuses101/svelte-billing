<script>
	/**
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} [head]
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props & { [key: string]: any }} */
	let props = $props();
</script>

<div class={`overflow-x-auto card shadow-xl rounded-xl border border-primary ${props.class}`}>
	<table class="table table-sm table-zebra m-0">
		<thead class="bg-primary text-primary-content">
			{@render props.head?.()}
		</thead>
		<tbody>
			{@render props.children?.()}
		</tbody>
	</table>
</div>
