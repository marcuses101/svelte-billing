<script lang="ts">
	import { page } from '$app/stores';
	import BackButton from '$lib/components/BackButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';

	export let data;

	const routeInfo = {
		'/coaches/[id]': {
			name: 'Info'
		},
		'/coaches/[id]/edit': {
			name: 'Edit Info'
		},
		'/coaches/[id]/lessons': { name: 'Lessons' },
		'/coaches/[id]/pay-slips': { name: 'Pay Slips' }
	};
	const fullName = `${data.coach.User.firstName} ${data.coach.User.lastName}`;
	$: route = $page.route.id as keyof typeof routeInfo;
	$: currentRouteInfo = routeInfo[route];
	$: {
		console.log(currentRouteInfo);
	}
	let coachId = $page.params.id;
</script>

<div style={`--transition-name:coach-${data.coach.id}`}>
	<PageHeader title={fullName} titleClass={`[view-transition-name:var(--transition-name)]`}>
		<span slot="title-post"> {' - '}{currentRouteInfo.name}</span>
		<BackButton href="/coaches">Back to Coaches</BackButton>
	</PageHeader>
</div>

<div class="join mb-8">
	<a
		class="btn btn-outline join-item"
		class:btn-active={route === '/coaches/[id]' || route === '/coaches/[id]/edit'}
		href={`/coaches/${coachId}`}
	>
		Info
	</a>
	<a
		class="btn btn-outline join-item"
		class:btn-active={route === '/coaches/[id]/lessons'}
		href={`/coaches/${coachId}/lessons`}
	>
		Lessons
	</a>
	<a
		class="btn btn-outline join-item"
		class:btn-active={route === '/coaches/[id]/pay-slips'}
		href={`/coaches/${coachId}/pay-slips`}
	>
		Invoices
	</a>
</div>

<slot />
