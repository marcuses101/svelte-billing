<script>
	import { page } from '$app/stores';
	import BackButton from '$lib/components/BackButton.svelte';
	import CancelButton from '$lib/components/CancelButton.svelte';
	import EditButton from '$lib/components/EditButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import CancelIcon from '$lib/icons/CancelIcon.svelte';
	import PencilIcon from '$lib/icons/PencilIcon.svelte';
	import CoachForm from '../CoachForm.svelte';
	export let data;
	const { firstName, lastName, id } = data.coach;
	const fullName = `${firstName} ${lastName}`;
	const toastMessage = firstName && lastName ? `${fullName} updated!` : 'Coach updated!';

	$: isEdit = $page.url.searchParams.get('edit') === 'true';
</script>

{#if $page.url.searchParams.get('success') === 'true'}
	<Toast>
		{toastMessage}
	</Toast>
{/if}

{#if isEdit}
	<PageHeader title="Coach Info Edit">
		<span slot="title-pre" style={`--transition-name:coach-${id}`}>
			<span class="[view-transition-name:var(--transition-name)]">{fullName}</span>{' - '}
		</span>
		<div class="flex gap-1">
			<CancelButton href={`/coaches/${$page.params.id}`} />
			<BackButton href="/coaches">Back to Coaches</BackButton>
		</div>
	</PageHeader>
{:else}
	<PageHeader title="Coach Info">
		<span slot="title-pre" style={`--transition-name:coach-${id}`}>
			<span class="[view-transition-name:var(--transition-name)]">{fullName}</span>{' - '}
		</span>
		<div class="flex gap-1">
			<a class="btn btn-primary btn-outline" href={`/coaches/${$page.params.id}?edit=true`}>
				<PencilIcon />
				Edit
			</a>
			<BackButton href="/coaches">Back to Coaches</BackButton>
		</div>
	</PageHeader>
{/if}
<CoachForm
	showReset={false}
	disabled={!isEdit}
	firstName={data.coach.firstName ?? ''}
	lastName={data.coach.lastName ?? ''}
	email={data.coach.email ?? ''}
	hourlyRateInCents={data.coach.hourlyRateInCents ?? ''}
/>
