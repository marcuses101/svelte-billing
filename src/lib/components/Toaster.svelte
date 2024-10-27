<script lang="ts">
	import { fly } from 'svelte/transition';
	import { toasterState } from './toaster.svelte';
</script>

{#key toasterState.currentToast?.id}
	<div
		in:fly={{ y: 50 }}
		out:fly={{ y: -50 }}
		class="fixed bottom-8 left-1/2 transform -translate-x-1/2"
	>
		{#if toasterState.currentToast}
			<div
				class:alert-error={toasterState.currentToast?.alertType === 'error'}
				class:alert-info={toasterState.currentToast?.alertType === 'info'}
				class:alert-warning={toasterState.currentToast?.alertType === 'warning'}
				class:alert-success={toasterState.currentToast?.alertType === 'success'}
				class="alert grid-1"
			>
				<span class="text-center">
					{toasterState.currentToast?.message}
				</span>
			</div>
		{/if}
	</div>
{/key}
