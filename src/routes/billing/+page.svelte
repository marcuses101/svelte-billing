<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="prose">
	<h1>Billing</h1>
	{#if $page.form?.success}
		<p>Invoice data generated</p>
	{/if}
	{#if $page.form?.error}
		<p>Failed to generate Invoices Data</p>
	{/if}
	<form method="POST" action="?/generateBills">
		<button class="btn btn-primary" type="submit">Generate Bills</button>
	</form>
</div>
