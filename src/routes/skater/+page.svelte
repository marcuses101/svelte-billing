<script lang="ts">
	export let data;
</script>

<section class="prose">
	<h1>Skaters List</h1>
	<a class="btn" href={`/skater/create`}><button>New Skater</button></a>
	<ul>
		{#each data.skaters as skater}
			<li>
				<a href={`/skater/${skater.id}`}>{`${skater.firstName} ${skater.lastName}`} </a>
			</li>
		{/each}
	</ul>
</section>
