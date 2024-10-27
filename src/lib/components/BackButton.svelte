<script lang="ts">
	import { page } from '$app/stores';
	import type { Snippet } from 'svelte';

	const lastPart = $page.url.pathname.lastIndexOf('/');
	const truncated = $page.url.pathname.slice(0, lastPart);
	interface Props {
		href?: string;
		children?: Snippet;
	}

	let { href = truncated, children }: Props = $props();
</script>

<a class="btn btn-outline" {href}>
	<svg
		class="h-6 w-6 fill-current md:h-8 md:w-8"
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		><path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" /></svg
	>
	{@render children?.()}
</a>
