<script lang="ts">
	export let isLoggedIn: boolean;
</script>

<header>
	<nav class="navbar bg-neutral flex text-neutral-content">
		<div class="flex-1">
			<a href="/" class="btn btn-ghost normal-case text-xl">Svelte Billing</a>
		</div>
		<div class="flex-none">
			<a class="btn btn-ghost" href="/about">About</a>
			{#if !isLoggedIn}
				<a class="btn btn-ghost" href="/login">Login</a>
			{:else}
				<a class="btn btn-ghost" href="/lesson">Lesson</a>
				<a class="btn btn-ghost" href="/skater">Skater</a>
				<form method="POST" action="/logout">
					<button class="btn btn-ghost" type="submit">Logout</button>
				</form>
			{/if}
		</div>
	</nav>
</header>
