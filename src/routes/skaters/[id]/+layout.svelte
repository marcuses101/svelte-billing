<script lang="ts">
	import { page } from '$app/stores';
	import BackButton from '$lib/components/BackButton.svelte';
	import CancelButton from '$lib/components/CancelButton.svelte';
	import EditButton from '$lib/components/EditButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import CancelIcon from '$lib/icons/CancelIcon.svelte';

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
	<div class="flex gap-2">
		{#if $page.url.pathname !== `/skaters/${id}/edit`}
			<EditButton href={`/skaters/${id}/edit`} />
		{:else}
			<button class="btn btn-outline btn-error" on:click={() => history.back()}>
				<CancelIcon />
				Cancel
			</button>
		{/if}
		<BackButton href={`/skaters`}>Skaters</BackButton>
	</div>
</PageHeader>

{#if $page.url.pathname !== `/skaters/${id}/edit`}
	<div class="join mb-2">
		<a
			class="btn btn-outline join-item"
			class:btn-active={$page.url.pathname === `/skaters/${id}`}
			href={`/skaters/${id}`}>Info</a
		>
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
{/if}
<div>
	<slot />
</div>
