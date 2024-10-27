<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		fullWidth?: boolean;
		form?: string | undefined;
		children?: Snippet;
	}
	let { fullWidth = false, form = undefined, children }: Props = $props();
</script>

<button class="btn btn-primary {fullWidth ? 'w-full' : ''}" type="submit" {form}>
	{#if children}
		{@render children()}
	{:else}
		Submit
	{/if}
</button>
