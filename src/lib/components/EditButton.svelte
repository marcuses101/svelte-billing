<script lang="ts">
	import PencilIcon from '$lib/icons/PencilIcon.svelte';
	export let href: string;
	export let size: 'small' | 'normal' | 'large' | undefined = undefined;
</script>

<a
	class="btn btn-primary btn-outline"
	class:btn-sm={size === 'small'}
	class:btn-lg={size === 'large'}
	{href}
>
	<PencilIcon />
	<slot>Edit</slot>
</a>
