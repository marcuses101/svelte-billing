<script lang="ts">
	import Hamburger from '$lib/icons/Hamburger.svelte';

	export let isLoggedIn: boolean;
	export let links: { href: string; displayText: string }[];
</script>

<header>
	<nav class="navbar bg-neutral flex text-neutral-content">
		<div class="flex-1">
			<a href="/" class="btn btn-ghost normal-case text-xl">Svelte Billing</a>
		</div>
		<div class="flex-none hidden sm:flex">
			{#each links as { href, displayText }}
				<a class="btn btn-ghost" {href}>{displayText}</a>
			{/each}
			{#if isLoggedIn}
				<form method="POST" action="/logout">
					<button class="btn btn-ghost" type="submit">Logout</button>
				</form>
			{/if}
		</div>
		<label for="drawer-input" class="sm:hidden drawer-button btn btn-ghost">
			<Hamburger />
		</label>
	</nav>
</header>
