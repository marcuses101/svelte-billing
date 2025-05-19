<script lang="ts">
	import type { MouseEventHandler } from 'svelte/elements';

	import PencilIcon from '$lib/icons/PencilIcon.svelte';
	import type { Sizes } from './buttonClassMaps';
	import LinkButton from './LinkButton.svelte';
	import Button from './Button.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		href?: string | undefined;
		size?: Sizes;
		children?: Snippet;
		onclick?: MouseEventHandler<HTMLElement>;
	}

	let { href = undefined, size, children, onclick }: Props = $props();
</script>

{#if href}
	<LinkButton {href} {onclick} color="primary" btnStyle="outline" {size}>
		<PencilIcon />
		{#if children}{@render children()}{:else}Edit{/if}
	</LinkButton>
{:else}
	<Button {onclick} color="primary" btnStyle="outline" {size}>
		<PencilIcon />
		{#if children}{@render children()}{:else}Edit{/if}
	</Button>
{/if}
