<script lang="ts">
	import { onMount } from 'svelte';
	import { scale } from 'svelte/transition';

	interface Props {
		toastVisible?: boolean;
		timeVisibleInMilliseconds?: number;
		alertType?: 'success' | 'error' | 'info' | 'warning';
		children?: import('svelte').Snippet;
	}

	let {
		toastVisible = $bindable(true),
		timeVisibleInMilliseconds = 3000,
		alertType = 'success',
		children
	}: Props = $props();

	onMount(() => {
		setTimeout(() => {
			toastVisible = false;
		}, timeVisibleInMilliseconds);
	});
</script>

{#if toastVisible}
	<div transition:scale class="toast toast-center z-50">
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
