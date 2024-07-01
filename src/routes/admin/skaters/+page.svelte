<script lang="ts">
	import AddButton from '$lib/components/AddButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import StyledTable from '$lib/components/StyledTable.svelte';

	export let data;
</script>

<PageHeader title="Skater List" />
<AddButton href="/admin/skaters/create">Add Skater</AddButton>
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
					class="link link-primary font-bold no-underline [view-transition-name:var(--transition-name)]"
					href={`/admin/skaters/${skater.id}`}
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
