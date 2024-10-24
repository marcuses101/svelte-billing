<script lang="ts">
	import CancelIcon from '$lib/icons/CancelIcon.svelte';
	import type { MouseEventHandler } from 'svelte/elements';

	interface Props {
		href?: string | undefined;
		size?: 'xs' | 'sm' | 'md' | 'lg';
		onclick?: MouseEventHandler<HTMLElement>;
		children?: import('svelte').Snippet;
	}

	let { href = undefined, size = 'md', onclick, children }: Props = $props();
</script>

{#if href}
	<a
		class:btn-xs={size === 'xs'}
		class:btn-sm={size === 'sm'}
		class:btn-md={size === 'md'}
		class:btn-lg={size === 'lg'}
		{onclick}
		class="btn btn-outline btn-error"
		{href}
	>
		<CancelIcon />
		{#if children}{@render children()}{:else}Cancel{/if}
	</a>
{:else}
	<button
		class:btn-xs={size === 'xs'}
		class:btn-sm={size === 'sm'}
		class:btn-md={size === 'md'}
		class:btn-lg={size === 'lg'}
		{onclick}
		class="btn btn-outline btn-error"
	>
		<CancelIcon />
		{#if children}{@render children()}{:else}Cancel{/if}
	</button>
{/if}
