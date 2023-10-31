<script lang="ts">
	import CancelIcon from '$lib/icons/CancelIcon.svelte';
	export let href: string;
</script>

<a class="btn btn-outline btn-error" {href}>
	<CancelIcon />
	<slot>Cancel</slot>
</a>
