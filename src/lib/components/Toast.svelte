<script lang="ts">
	import { onMount } from 'svelte';
	import { scale } from 'svelte/transition';

	export let toastVisible = true;
	export let timeVisibleInMilliseconds = 3000;
	onMount(() => {
		setTimeout(() => {
			toastVisible = false;
		}, timeVisibleInMilliseconds);
	});
</script>

{#if toastVisible}
	<div transition:scale class="toast toast-center">
		<div class="alert alert-success grid-1">
			<span class="text-center">
				<slot />
			</span>
		</div>
	</div>
{/if}
