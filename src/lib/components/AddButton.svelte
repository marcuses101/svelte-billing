<script lang="ts">
	export let href: string = '';
</script>

<a {href} class="btn btn-outline btn-primary border-dashed w-full">
	+ <slot />
</a>
