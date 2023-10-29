<script lang="ts">
	export let title: string;
	export let subTitle: string | undefined = undefined;
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div class="flex justify-between prose max-w-none mb-4">
	<div>
		<h1 class="prose-h1">{title}</h1>
		{#if subTitle}
			<p class="m-0 text-neutral-500 mt-2">{subTitle}</p>
		{/if}
	</div>
	<div>
		<slot />
	</div>
</div>
