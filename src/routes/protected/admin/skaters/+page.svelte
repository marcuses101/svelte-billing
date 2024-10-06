<script lang="ts">
	import AddButton from '$lib/components/AddButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import StyledTable from '$lib/components/StyledTable.svelte';

	export let data;
</script>

<PageHeader title="Skater List" />
<AddButton href="/protected/admin/skaters/create">Add Skater</AddButton>
<StyledTable containerClass="mt-8">
	<tr slot="head">
		<td>Name</td>
		<td>Type</td>
	</tr>
	{#each data.skaters as { id, firstName, lastName, skaterTypeCode }}
		<tr>
			<td style={`--transition-name:skater-${id}`}>
				<a
					class="link link-primary font-bold no-underline [view-transition-name:var(--transition-name)]"
					href={`/protected/admin/skaters/${id}`}
				>
					{`${firstName} ${lastName}`}
				</a>
			</td>
			<td>{skaterTypeCode}</td>
		</tr>
	{:else}
		<tr>
			<td>No Skaters Created</td>
		</tr>
	{/each}
</StyledTable>
