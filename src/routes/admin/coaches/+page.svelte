<script>
	import PageHeader from '$lib/components/PageHeader.svelte';
	import StyledTable from '$lib/components/StyledTable.svelte';

	export let data;
	export let form;
	console.log(form);
</script>

<PageHeader title="Coaches" />
<a class="btn btn-outline btn-primary border-dashed w-full mb-4" href="admin/coaches/create">
	+ Add Coach
</a>

<StyledTable>
	<tr slot="head">
		<td>Name</td>
		<td>Email</td>
		<td>Email Confirmation</td>
	</tr>
	{#each data.coaches as { id, firstName, lastName, emailConfirmation, email }}
		<tr>
			<td style={`--transition-name:coach-${id}`}>
				<a
					class="link link-primary font-bold no-underline [view-transition-name:var(--transition-name)]"
					href={`/admin/coaches/${id}`}
				>
					{`${firstName} ${lastName}`}
				</a>
			</td>
			<td>{email}</td>
			<td>
				{#if emailConfirmation === 'NotSent'}
					<form method="POST" action="?/send-confirmation">
						<input type="hidden" name="coach-id" value={id} />
						<button class="btn btn-sm btn-outline btn-secondary" type="submit"
							>Send Confirmation Email</button
						>
					</form>
				{:else}
					{emailConfirmation}
				{/if}
			</td>
		</tr>
	{/each}
</StyledTable>
