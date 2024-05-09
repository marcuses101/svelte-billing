<script lang="ts">
	export let title: string;
	export let subTitle: string | undefined = undefined;
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div class="flex justify-between prose max-w-none mb-8">
	<div>
		<h1 class="mb-0">
			<slot name="title-pre" />
			{title}
			<slot name="title-post" />
		</h1>
		{#if subTitle}
			<p class="m-0 text-neutral-500 mt-2">{subTitle}</p>
		{/if}
	</div>
	<div>
		<slot />
	</div>
</div>
