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
		{ href: '/coach', displayText: 'Coach', visibility: 'authenticated' },
		{ href: '/billing', displayText: 'Billing', visibility: 'authenticated' }
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

<div class="drawer drawer-closed lg:drawer-open">
	<input bind:checked={isDrawerOpen} id="drawer-input" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex flex-col min-h-[100dvh]">
		<Header {isLoggedIn} />
		<main>
			<slot />
		</main>
	</div>
	<div class="drawer-side">
		<label for="drawer-input" aria-label="close sidebar" class="drawer-overlay" />
		<ul class="menu p-4 w-56 min-h-full bg-base-200 text-base-content">
			{#each visibleLinks as { href, displayText }}
				<li><a on:click={closeDrawer} {href}>{displayText}</a></li>
			{/each}
		</ul>
	</div>
</div>

<style>
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		box-sizing: border-box;
	}
</style>
