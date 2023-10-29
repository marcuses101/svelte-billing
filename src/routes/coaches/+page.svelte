<script>
	export let data;
</script>

<div class="prose max-w-none">
	<h1>Coaches</h1>
	<a class="btn btn-outline btn-primary border-dashed w-full" href="/coaches/create">+ Add Coach</a>
	<section class="my-4 grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-2">
		{#each data.coaches as { id, firstName, lastName }}
			<a class="btn" href={`/coaches/${id}`}>{`${firstName} ${lastName}`} </a>
		{/each}
	</section>
</div>
