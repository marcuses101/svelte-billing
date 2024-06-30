<script lang="ts">
	import AddButton from '$lib/components/AddButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import StyledTable from '$lib/components/StyledTable.svelte';

	export let data;
</script>

<section class="prose max-w-none">
	<PageHeader title="Skater List" />
	<AddButton href="/skaters/create">Add Skater</AddButton>
	<StyledTable containerClass="mt-8">
		<tr slot="head">
			<td>Name</td>
			<td>Email</td>
			<td>Type</td>
		</tr>
		{#each data.skaters as skater}
			<tr>
				<td style={`--transition-name:skater-${skater.id}`}>
					<a
						class="link link-primary [view-transition-name:var(--transition-name)]"
						href={`/skaters/${skater.id}`}
					>
						{`${skater.firstName} ${skater.lastName}`}
					</a>
				</td>
				<td>{skater.email}</td>
				<td>{skater.skaterTypeCode}</td>
			</tr>
		{:else}
			<tr>
				<td>No Skaters Created</td>
			</tr>
		{/each}
	</StyledTable>
	<!--
	<section class="my-4 grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-2">
		{#each data.skaters as skater}
			<a class="btn" href={`/skaters/${skater.id}`}>
				<span
					style={`--transition-name:skater-${skater.id}`}
					class="[view-transition-name:var(--transition-name)]"
					>{`${skater.firstName} ${skater.lastName}`}
				</span></a
			>
		{/each}
	</section>
    -->
</section>
