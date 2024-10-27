<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		title: string;
		subTitle?: string;
		titleClass?: string;
		children?: Snippet;
		titlePost?: Snippet;
		titlePre?: Snippet;
	};
	const {
		title,
		titleClass = '',
		subTitle = undefined,
		children,
		titlePre,
		 titlePost
	}: Props = $props();
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div class="flex justify-between prose max-w-none mb-8">
	<div>
		<h1 class={`mb-0 `}>
			{@render titlePre?.()}
			<span class={titleClass}>{title}</span>
			{@render titlePost?.()}
		</h1>
		{#if subTitle}
			<p class="m-0 text-neutral-500 mt-2">{subTitle}</p>
		{/if}
	</div>
	<div>
		{@render children?.()}
	</div>
</div>
