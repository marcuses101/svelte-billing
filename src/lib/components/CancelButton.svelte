<script lang="ts">
	import CancelIcon from '$lib/icons/CancelIcon.svelte';
	export let href: string | undefined = undefined;
	export let size: 'xs' | 'sm' | 'md' | 'lg' = 'md';
</script>

{#if href}
	<a
		class:btn-xs={size === 'xs'}
		class:btn-sm={size === 'sm'}
		class:btn-md={size === 'md'}
		class:btn-lg={size === 'lg'}
		on:click
		class="btn btn-outline btn-error"
		{href}
	>
		<CancelIcon />
		<slot>Cancel</slot>
	</a>
{:else}
	<button
		class:btn-xs={size === 'xs'}
		class:btn-sm={size === 'sm'}
		class:btn-md={size === 'md'}
		class:btn-lg={size === 'lg'}
		on:click
		class="btn btn-outline btn-error"
	>
		<CancelIcon />
		<slot>Cancel</slot>
	</button>
{/if}
