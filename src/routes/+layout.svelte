<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import type { LayoutData } from './$types';
	import Header from './Header.svelte';
	import '../app.css';
	import { page } from '$app/stores';
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
		{ href: '/about', displayText: 'About', visibility: 'unauthenticated' },
		{ href: '/overview', displayText: 'Overview', visibility: 'authenticated' },
		{ href: '/ledger', displayText: 'Ledger', visibility: 'authenticated' },
		{ href: '/lessons', displayText: 'Lessons', visibility: 'authenticated' },
		{ href: '/skaters', displayText: 'Skaters', visibility: 'authenticated' },
		{ href: '/payment', displayText: 'Payments', visibility: 'authenticated' },
		{ href: '/invoices', displayText: 'Invoices', visibility: 'authenticated' },
		{ href: '/coach-payment', displayText: 'Coach Payments', visibility: 'authenticated' },
		{ href: '/coaches', displayText: 'Coaches', visibility: 'authenticated' },
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

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
	$: baseSegment = '/' + $page.url.pathname.split('/')[1];
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
				<li>
					<a class:active={baseSegment === href} on:click={closeDrawer} {href}>{displayText}</a>
				</li>
			{/each}
		</ul>
	</div>
</div>

<style>
	main {
		flex: 1;
		padding: 1rem;
		width: 100%;
		box-sizing: border-box;
	}
</style>
