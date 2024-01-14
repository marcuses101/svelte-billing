<script>
	export let data;
	const {
		skater: { id },
		invoices
	} = data;
	console.log(invoices);
	const formatDate = new Intl.DateTimeFormat('en-CA', { dateStyle: 'short' }).format;
</script>

<a class="btn" href={`/skaters/${id}/invoices/current`}>Preview</a>
<ul>
	{#each invoices as { id: invoiceId, invoiceDate }}
		<li class="list-disc m-4">
			<a class="btn" href={`/skaters/${id}/invoices/${invoiceId}`}> {formatDate(invoiceDate)}</a>
		</li>
	{/each}
</ul>
