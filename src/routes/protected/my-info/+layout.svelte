<script>
	import { page } from '$app/stores';
	import PageHeader from '$lib/components/PageHeader.svelte';
</script>

<PageHeader title="My Info" />

<div class="join mb-8">
	<a
		class="btn btn-outline join-item"
		class:btn-active={$page.route.id === '/protected/my-info'}
		href="/protected/my-info"
	>
		Info
	</a>
	<a
		class="btn btn-outline join-item"
		class:btn-active={$page.url.pathname.includes('lessons')}
		href={`/protected/my-info/lessons`}>Lessons</a
	>
	<a
		class="btn btn-outline join-item"
		class:btn-active={$page.url.pathname.includes('pay-slips')}
		href={`/protected/my-info/pay-slips`}>Pay Slips</a
	>
</div>
<slot />
