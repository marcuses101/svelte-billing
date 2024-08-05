<script>
	export let containerClass = '';
</script>

<div class={`overflow-x-auto card shadow-xl rounded-xl border border-primary ${containerClass}`}>
	<table class="table table-sm table-zebra m-0">
		<thead class="bg-primary text-primary-content">
			<slot name="head" />
		</thead>
		<tbody>
			<slot />
		</tbody>
	</table>
</div>
