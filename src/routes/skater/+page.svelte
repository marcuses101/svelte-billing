<script lang="ts">
	import AddButton from '$lib/components/AddButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';

	export let data;
</script>

<section class="prose max-w-none">
	<PageHeader title="Skater List" />
	<AddButton href="/skater/create">Add Skater</AddButton>
	<section class="my-4 grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-2">
		{#each data.skaters as skater}
			<a class="btn" href={`/skater/${skater.id}`}>
				<span
					style={`--transition-name:skater-${skater.id}`}
					class="[view-transition-name:var(--transition-name)]"
					>{`${skater.firstName} ${skater.lastName}`}
				</span></a
			>
		{/each}
	</section>
</section>
