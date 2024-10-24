<script lang="ts">
	let { data } = $props();
	const user = data?.user;
</script>

<svelte:head>
	<title>Baddest of Billing</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="prose container mx-auto">
	{#if user}
		<h1 class="text-center">Welcome to Baddest of Billing - {user.firstName} {user.lastName}</h1>
	{:else}
		<h1 class="text-center">Welcome to Baddest of Billing</h1>
	{/if}
</section>
