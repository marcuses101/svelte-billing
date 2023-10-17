<script lang="ts">
	import type { LayoutData } from './$types';
	import Header from './Header.svelte';
	import '../app.css';
	export let data: LayoutData;
	const isLoggedIn = Boolean(data.user);
	let isDrawerOpen = false;

	function closeDrawer() {
		isDrawerOpen = false;
	}
	const links: {
		href: string;
		displayText: string;
		visibility: 'all' | 'authenticated' | 'unauthenticated';
	}[] = [
		{ href: '/about', displayText: 'About', visibility: 'all' },
		{ href: '/lesson', displayText: 'Lesson', visibility: 'authenticated' },
		{ href: '/skater', displayText: 'Skater', visibility: 'authenticated' },
		{ href: '/login', displayText: 'Login', visibility: 'unauthenticated' }
	];
	const visibleLinks = links.filter((link) => {
		if (link.visibility === 'all') {
			return true;
		}
		if (link.visibility === 'authenticated') {
			return isLoggedIn;
		}
		return !isLoggedIn;
	});
</script>

<div class="drawer drawer-end">
	<input bind:checked={isDrawerOpen} id="drawer-input" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content app">
		<Header {isLoggedIn} links={visibleLinks} />
		<main>
			<slot />
		</main>
		<footer class="footer footer-center p-4 bg-neutral text-neutral-content">
			<aside>
				<p>Copyright {new Date().getFullYear()}</p>
			</aside>
		</footer>
	</div>
	<div class="drawer-side">
		<label for="drawer-input" aria-label="close sidebar" class="drawer-overlay" />
		<ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
			{#each visibleLinks as { href, displayText }}
				<li><a on:click={closeDrawer} {href}>{displayText}</a></li>
			{/each}
			{#if isLoggedIn}
				<li>
					<form method="POST" class="flex" on:submit={closeDrawer} action="/logout">
						<button class="w-full text-left" on:click={closeDrawer} type="submit">Logout</button>
					</form>
				</li>
			{/if}
		</ul>
	</div>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		box-sizing: border-box;
	}
</style>
