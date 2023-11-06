<script>
	import PageHeader from '$lib/components/PageHeader.svelte';
	export let data;
	const {
		skater: { firstName, lastName, id }
	} = data;
	const fullName = `${firstName} ${lastName}`;
</script>

<PageHeader title="Invoices">
	<span slot="title-pre">
		<span
			style={`--transition-name:skater-${id}`}
			class="[view-transition-name:var(--transition-name)]"
		>
			{fullName}
		</span>{' - '}
	</span>
</PageHeader>
