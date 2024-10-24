<script lang="ts">
	import type { MouseEventHandler } from 'svelte/elements';

	import PencilIcon from '$lib/icons/PencilIcon.svelte';
	interface Props {
		href?: string | undefined;
		size?: 'xs' | 'sm' | 'md' | 'lg';
		children?: import('svelte').Snippet;
		onclick?: MouseEventHandler<HTMLElement>;
	}

	let { href = undefined, size = 'md', children, onclick }: Props = $props();
</script>

{#if href}
	<a
		class="btn btn-primary btn-outline"
		class:btn-xs={size === 'xs'}
		class:btn-sm={size === 'sm'}
		class:btn-md={size === 'md'}
		class:btn-lg={size === 'lg'}
		{onclick}
		{href}
	>
		<PencilIcon />
		{#if children}{@render children()}{:else}Edit{/if}
	</a>
{:else}
	<button
		{onclick}
		class="btn btn-primary btn-outline"
		class:btn-xs={size === 'xs'}
		class:btn-sm={size === 'sm'}
		class:btn-md={size === 'md'}
		class:btn-lg={size === 'lg'}
	>
		<PencilIcon />
		{#if children}{@render children()}{:else}Edit{/if}
	</button>
{/if}
