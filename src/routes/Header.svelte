<script lang="ts">
	import Hamburger from '$lib/icons/Hamburger.svelte';

	export let isLoggedIn: boolean;
</script>

<header>
	<nav class="navbar flex">
		<div class="flex-1">
			<a href="/" class="btn btn-ghost normal-case text-xl">Svelte Billing</a>
		</div>
		<div class="flex-none">
			{#if isLoggedIn}
				<form method="POST" action="/logout">
					<button class="btn btn-ghost" type="submit">Logout</button>
				</form>
			{:else}
				<a href="/login" class="btn btn-ghost">Login</a>
			{/if}
		</div>
		<label for="drawer-input" class="flex lg:hidden drawer-button btn btn-ghost">
			<Hamburger />
		</label>
	</nav>
</header>
