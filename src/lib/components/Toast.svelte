<script lang="ts">
	import { onMount } from 'svelte';
	import { scale } from 'svelte/transition';

	export let toastVisible = true;
	export let timeVisibleInMilliseconds = 3000;
	export let alertType: 'success' | 'error' | 'info' | 'warning' = 'success';

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
				<slot />
			</span>
		</div>
	</div>
{/if}
