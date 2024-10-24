<script lang="ts">
	interface Props {
		href?: string;
		children?: import('svelte').Snippet;
	}

	let { href = '', children }: Props = $props();
</script>

<a {href} class="btn btn-outline btn-primary border-dashed w-full">
	+ {@render children?.()}
</a>
