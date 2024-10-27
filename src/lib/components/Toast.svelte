<script lang="ts">
	import { onMount } from 'svelte';
	import type { EventHandler } from 'svelte/elements';
	import { fly } from 'svelte/transition';

	interface ToastProps {
		toastVisible?: boolean;
		timeVisibleInMilliseconds?: number;
		alertType?: 'success' | 'error' | 'info' | 'warning';
		children?: import('svelte').Snippet;
		onoutroend?: EventHandler<CustomEvent<null>, HTMLDivElement>;
	}

	let {
		toastVisible = $bindable(true),
		timeVisibleInMilliseconds = 3000,
		alertType = 'success',
		children,
		onoutroend
	}: ToastProps = $props();

	onMount(() => {
		setTimeout(() => {
			toastVisible = false;
		}, timeVisibleInMilliseconds);
	});
</script>

{#if toastVisible}
	<div
		transition:fly={{ y: 50 }}
		{onoutroend}
		class="fixed bottom-8 left-1/2 transform -translate-x-1/2"
	>
		<div
			class:alert-error={alertType === 'error'}
			class:alert-info={alertType === 'info'}
			class:alert-warning={alertType === 'warning'}
			class:alert-success={alertType === 'success'}
			class="alert grid-1"
		>
			<span class="text-center">
				{@render children?.()}
			</span>
		</div>
	</div>
{/if}
