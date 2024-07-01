<script>
	import PageHeader from '$lib/components/PageHeader.svelte';

	export let data;
</script>

<PageHeader title="Coaches" />
<a class="btn btn-outline btn-primary border-dashed w-full" href="admin/coaches/create"
	>+ Add Coach</a
>
<section class="my-4 grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-2">
	{#each data.coaches as { id, firstName, lastName }}
		<a class={'btn'} href={`/admin/coaches/${id}`}
			><span
				style={`--transition-name:coach-${id}`}
				class="[view-transition-name:var(--transition-name)]">{`${firstName} ${lastName}`}</span
			>
		</a>
	{/each}
</section>
