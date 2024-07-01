<script lang="ts">
	import { page } from '$app/stores';
	import BackButton from '$lib/components/BackButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';

	export let data;

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
	$: title = getTitle($page.url.pathname);
</script>

<PageHeader {title}>
	<span slot="title-pre">
		<span
			style={`--transition-name:skater-${id}`}
			class="[view-transition-name:var(--transition-name)]"
		>
			{fullName}
		</span>{' - '}
	</span>
	<BackButton href={`/skaters`}>Skaters</BackButton>
</PageHeader>

<div class="flex flex-row justify-between">
	<div class="join mb-2">
		<a
			class="btn btn-outline join-item"
			class:btn-active={$page.route.id === `/skaters/[id]` ||
				$page.route.id === '/skaters/[id]/edit'}
			href={`/skaters/${id}`}
		>
			Info
		</a>
		<a
			class="btn btn-outline join-item"
			class:btn-active={$page.url.pathname.includes('lessons')}
			href={`/skaters/${id}/lessons`}>Lessons</a
		>
		<a
			class="btn btn-outline join-item"
			class:btn-active={$page.url.pathname.includes('invoices')}
			href={`/skaters/${id}/invoices`}>Invoices</a
		>
	</div>
	{#if $page.route.id === '/skaters/[id]/invoices/[invoiceId]' || $page.route.id === '/skaters/[id]/invoices/current'}
		<BackButton />
	{:else}
		<div />
	{/if}
</div>
<slot />
