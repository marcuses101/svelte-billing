<script lang="ts">
	import { page } from '$app/stores';
	import BackButton from '$lib/components/BackButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';

	let { data, children } = $props();

	const { firstName, lastName, id } = data.skater;
	const fullName = `${firstName} ${lastName}`;
	function getTitle(pathname: string) {
		const parts = pathname.split('/');
		if (parts.length === 3) return 'Info';
		if (pathname.includes('edit')) return 'Edit';
		if (pathname.includes('invoices')) return 'Invoices';
		if (pathname.includes('lessons')) return 'Lessons';
		return '';
	}
	let title = $derived(getTitle($page.url.pathname));
</script>

<PageHeader {title}>
	<!-- @migration-task: migrate this slot by hand, `title-pre` is an invalid identifier -->
	{#snippet titlePre()}
		<span>
			<span
				style={`--transition-name:skater-${id}`}
				class="[view-transition-name:var(--transition-name)]"
			>
				{fullName}
			</span>{' - '}
		</span>
	{/snippet}
	<BackButton href={`/protected/admin/skaters`}>Skaters</BackButton>
</PageHeader>

<div class="flex flex-row justify-between">
	<div class="join mb-2">
		<a
			class="btn btn-outline join-item"
			class:btn-active={$page.route.id === `/protected/admin/skaters/[id]` ||
				$page.route.id === '/protected/admin/skaters/[id]/edit'}
			href={`/protected/admin/skaters/${id}`}
		>
			Info
		</a>
		<a
			class="btn btn-outline join-item"
			class:btn-active={$page.url.pathname.includes('lessons')}
			href={`/protected/admin/skaters/${id}/lessons`}>Lessons</a
		>
		<a
			class="btn btn-outline join-item"
			class:btn-active={$page.url.pathname.includes('invoices')}
			href={`/protected/admin/skaters/${id}/invoices`}>Invoices</a
		>
	</div>
	{#if $page.route.id === '/protected/admin/skaters/[id]/invoices/[invoiceId]' || $page.route.id === '/skaters/[id]/invoices/current'}
		<BackButton />
	{:else}
		<div></div>
	{/if}
</div>
{@render children?.()}
