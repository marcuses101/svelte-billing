<script lang="ts">
	import PencilIcon from '$lib/icons/PencilIcon.svelte';
	export let href: string | undefined = undefined;
	export let size: 'xs' | 'sm' | 'md' | 'lg' = 'md';
</script>

{#if href}
	<a
		on:click
		class="btn btn-primary btn-outline"
		class:btn-xs={size === 'xs'}
		class:btn-sm={size === 'sm'}
		class:btn-md={size === 'md'}
		class:btn-lg={size === 'lg'}
		{href}
	>
		<PencilIcon />
		<slot>Edit</slot>
	</a>
{:else}
	<button
		on:click
		class="btn btn-primary btn-outline"
		class:btn-xs={size === 'xs'}
		class:btn-sm={size === 'sm'}
		class:btn-md={size === 'md'}
		class:btn-lg={size === 'lg'}
	>
		<PencilIcon />
		<slot>Edit</slot>
	</button>
{/if}
