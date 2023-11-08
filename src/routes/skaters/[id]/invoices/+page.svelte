<script>
	export let data;
	const {
		skater: { id }
	} = data;
</script>

<a class="btn" href={`/skaters/${id}/invoices/current`}>Preview</a>
