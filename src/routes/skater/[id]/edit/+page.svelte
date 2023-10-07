<script lang="ts">
	export let data;
</script>

<h1>Edit Skater Info - {`${data.skater.firstName} ${data.skater.lastName}`}</h1>
<a href={`/skater/${data.skater.id}`}>Back</a>
