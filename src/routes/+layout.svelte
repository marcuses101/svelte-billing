<script lang="ts">
	import '../app.css';
	import { onNavigate } from '$app/navigation';
	import type { LayoutData } from './$types';
	import Header from './Header.svelte';
	import { page } from '$app/stores';
	import { ROLES } from '$lib/defs';
	import Toaster from '$lib/components/Toaster.svelte';
	import { toasterState } from '$lib/components/toaster.svelte';
	interface Props {
		data: LayoutData;
		children?: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();

	if (data.toast) {
		toasterState.addToast({ alertType: data.toast.alertType, message: data.toast.message });
	}
	const isLoggedIn = Boolean(data.user);
	let isDrawerOpen = $state(false);

	function closeDrawer() {
		isDrawerOpen = false;
	}

	const isCoach = Boolean(data.user?.UserRoles.some((role) => role.roleName === ROLES.COACH));
	const myInfoLinks = [
		{ href: '/protected/my-info', displayText: 'Overview', submenus: [] },
		{
			href: '/protected/my-info/lessons',
			displayText: 'Lessons',
			submenus: [
				{
					href: '/protected/my-info/lessons/create',
					displayText: 'Add Lesson'
				}
			]
		},
		{
			href: '/protected/my-info/additional-charges',
			displayText: 'Additional Charges',
			submenus: []
		},
		{ href: '/protected/my-info/pay-slips', displayText: 'Pay Slips', submenus: [] }
	];

	const isAdmin = Boolean(data.user?.UserRoles.some((role) => role.roleName === ROLES.ADMIN));
	const adminLinks = [
		{ href: '/protected/admin/overview', displayText: 'Overview', submenus: [] },
		{ href: '/protected/admin/users', displayText: 'Users', submenus: [] },
		{ href: '/protected/admin/ledgers', displayText: 'Ledgers', submenus: [] },
		{ href: '/protected/admin/billing', displayText: 'Billing', submenus: [] },
		{
			href: '/protected/admin/skaters',
			displayText: 'Skaters',
			submenus: [
				{ href: '/protected/admin/skater-payments', displayText: 'Payments' },
				{ href: '/protected/admin/skater-invoices', displayText: 'Invoices' }
			]
		},
		{
			href: '/protected/admin/coaches',
			displayText: 'Coaches',
			submenus: [
				{ href: '/protected/admin/coach-payments', displayText: 'Payments' },
				{ href: '/protected/admin/coach-payslips', displayText: 'Pay Slips' }
			]
		}
	];

	const links: {
		href: string;
		displayText: string;
		visibility: 'all' | 'authenticated' | 'unauthenticated';
	}[] = [{ href: '/about', displayText: 'About', visibility: 'unauthenticated' }];

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

	let baseSegment = $derived('/' + $page.url.pathname.split('/')[1]);
</script>

<div class="drawer drawer-closed lg:drawer-open">
	<input bind:checked={isDrawerOpen} id="drawer-input" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content min-h-dvh">
		<Header {isLoggedIn} />
		<main class="flex-1 p-4 w-full">
			{@render children?.()}
		</main>
	</div>
	<div class="drawer-side">
		<label for="drawer-input" aria-label="close sidebar" class="drawer-overlay"></label>
		<ul class="menu p-4 w-56 min-h-full bg-base-200 text-base-content">
			{#each visibleLinks as { href, displayText }}
				<li>
					<a class:active={baseSegment === href} onclick={closeDrawer} {href}>{displayText}</a>
				</li>
			{/each}
			{#if isCoach}
				<li class="menu-title">My Info</li>
				{#each myInfoLinks as { href, displayText, submenus }}
					<li>
						<a onclick={closeDrawer} {href}>
							{displayText}
						</a>
						{#if submenus.length > 0}
							<ul>
								{#each submenus as submenu}
									<li>
										<a onclick={closeDrawer} href={submenu.href}>
											{submenu.displayText}
										</a>
									</li>
								{/each}
							</ul>
						{/if}
					</li>
				{/each}
			{/if}
			{#if isAdmin}
				<li class="menu-title">Admin</li>
				{#each adminLinks as { href, displayText, submenus }}
					<li>
						<a class:active={$page.route.id?.startsWith(href)} onclick={closeDrawer} {href}>
							{displayText}
						</a>
						{#if submenus.length > 0}
							<ul>
								{#each submenus as submenu}
									<li>
										<a
											class:active={$page.route.id?.startsWith(submenu.href)}
											onclick={closeDrawer}
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
<Toaster />
