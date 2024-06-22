<script lang="ts">
	export let data;
	const user = data?.user;
	console.log(user);
	const userFullName = user && `${user.firstName} ${user.lastName}`;
</script>

<svelte:head>
	<title>Baddest of Billing</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="prose container mx-auto">
	{#if user}
		<h1 class="text-center">Welcome to Baddest of Billing - {userFullName}</h1>
	{:else}
		<h1 class="text-center">Welcome to Baddest of Billing</h1>
	{/if}
</section>
