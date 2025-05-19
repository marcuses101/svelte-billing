<script lang="ts">
	import CancelIcon from '$lib/icons/CancelIcon.svelte';
	import type { MouseEventHandler } from 'svelte/elements';
	import LinkButton from './LinkButton.svelte';
	import Button from './Button.svelte';
	import type { Sizes } from './buttonClassMaps';
	import type { Snippet } from 'svelte';

	interface Props {
		href?: string | undefined;
		size?: Sizes;
		onclick?: MouseEventHandler<HTMLElement>;
		children?: Snippet;
	}

	let { href = undefined, size, onclick, children }: Props = $props();
</script>

{#if href}
	<LinkButton {size} btnStyle="outline" color="error" {onclick}>
		<CancelIcon />
		{#if children}{@render children()}{:else}Cancel{/if}
	</LinkButton>
{:else}
	<Button {size} btnStyle="outline" color="error" {onclick}>
		<CancelIcon />
		{#if children}{@render children()}{:else}Cancel{/if}
	</Button>
{/if}
