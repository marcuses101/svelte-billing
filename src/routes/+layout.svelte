<script lang="ts">
	import '../app.css';
	import { onNavigate } from '$app/navigation';
	import type { LayoutData } from './$types';
	import Header from './Header.svelte';
	import { page } from '$app/stores';
	import { ROLES } from '$lib/defs';
	export let data: LayoutData;
	const isLoggedIn = Boolean(data.user);
	let isDrawerOpen = false;

	function closeDrawer() {
		isDrawerOpen = false;
	}

	const isAdmin = Boolean(data.user?.UserRoles.some((role) => role.roleName === ROLES.ADMIN));

	const adminLinks = [
		{ href: '/admin/overview', displayText: 'Overview', submenus: [] },
		{ href: '/admin/ledgers', displayText: 'Ledgers', submenus: [] },
		{ href: '/admin/billing', displayText: 'Billing', submenus: [] },
		{
			href: '/admin/skaters',
			displayText: 'Skaters',
			submenus: [
				{ href: '/admin/skater-payments', displayText: 'Payments' },
				{ href: '/admin/skater-invoices', displayText: 'Invoices' }
			]
		},
		{
			href: '/admin/coaches',
			displayText: 'Coaches',
			submenus: [
				{ href: '/admin/coach-payments', displayText: 'Payments' },
				{ href: '/admin/coach-payslips', displayText: 'Pay Slips' }
			]
		}
	];

	const links: {
		href: string;
		displayText: string;
		visibility: 'all' | 'authenticated' | 'unauthenticated';
	}[] = [
		{ href: '/about', displayText: 'About', visibility: 'unauthenticated' },
		{ href: '/lessons', displayText: 'Lessons', visibility: 'authenticated' }
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
		<main class="flex-1 p-4 w-full">
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
			{#if isAdmin}
				<li class="menu-title">Admin</li>
				{#each adminLinks as { href, displayText, submenus }}
					<li>
						<a class:active={$page.route.id?.startsWith(href)} on:click={closeDrawer} {href}>
							{displayText}
						</a>
						{#if submenus.length > 0}
							<ul>
								{#each submenus as submenu}
									<li>
										<a
											class:active={$page.route.id?.startsWith(submenu.href)}
											on:click={closeDrawer}
											href={submenu.href}
										>
											{submenu.displayText}
										</a>
									</li>
								{/each}
							</ul>
						{/if}
					</li>
				{/each}
			{/if}
		</ul>
	</div>
</div>
