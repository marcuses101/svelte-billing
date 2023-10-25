<script lang="ts">
	export let data;
</script>

<section class="prose max-w-none">
	<h1>Skaters List</h1>
	<a class="btn btn-outline btn-primary border-dashed w-full" href="/skater/create">+ Add Skater</a>
	<section class="my-4 grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-2">
		{#each data.skaters as skater}
			<a class="btn" href={`/skater/${skater.id}`}>{`${skater.firstName} ${skater.lastName}`} </a>
		{/each}
	</section>
</section>
