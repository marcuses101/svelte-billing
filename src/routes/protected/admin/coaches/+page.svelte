<script>
	import PageHeader from '$lib/components/PageHeader.svelte';
	import StyledTable from '$lib/components/StyledTable.svelte';

	let { data } = $props();
</script>

<PageHeader title="Coaches" />
<a class="btn btn-outline btn-primary border-dashed w-full mb-4" href="admin/coaches/create">
	+ Add Coach
</a>

<StyledTable>
	{#snippet head()}
		<tr >
			<td>Name</td>
		</tr>
	{/snippet}
	{#each data.coaches as { id, firstName, lastName }}
		<tr>
			<td style={`--transition-name:coach-${id}`}>
				<a
					class="link link-primary font-bold no-underline [view-transition-name:var(--transition-name)]"
					href={`/protected/admin/coaches/${id}`}
				>
					{`${firstName} ${lastName}`}
				</a>
			</td>
		</tr>
	{/each}
</StyledTable>
