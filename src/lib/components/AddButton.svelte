<script lang="ts">
	export let href: string = '';
</script>

<a
	{href}
	class="stats link-primary link-hover w-full shadow p-2 border border-dashed border-primary text-lg text-center"
>
	<slot />
</a>
