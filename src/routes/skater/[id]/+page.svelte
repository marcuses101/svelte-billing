<script lang="ts">
	export let data;
</script>

<h1>Skater Info - {`${data.skater.firstName} ${data.skater.lastName}`}</h1>
<a href={`/skater/${data.skater.id}/edit`}>Edit</a>
