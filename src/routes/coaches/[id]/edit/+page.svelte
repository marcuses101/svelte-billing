<script>
	import { page } from '$app/stores';
	import BackButton from '$lib/components/BackButton.svelte';
	import CancelButton from '$lib/components/CancelButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import CoachForm from '../../CoachForm.svelte';

	export let data;
	const {
		User: { firstName, lastName, email },
		id,
		hourlyRateInCents
	} = data.coach;
	const fullName = `${firstName} ${lastName}`;
</script>

<PageHeader title="Coach Edit">
	<span slot="title-pre" style={`--transition-name:coach-${id}`}>
		<span class="[view-transition-name:var(--transition-name)]">{fullName}</span>{' - '}
	</span>
	<div class="flex gap-1">
		<CancelButton href={`/coaches/${$page.params.id}`} />
		<BackButton href="/coaches">Back to Coaches</BackButton>
	</div>
</PageHeader>

<CoachForm
	showReset={false}
	firstName={firstName ?? ''}
	lastName={lastName ?? ''}
	email={email ?? ''}
	hourlyRateInCents={hourlyRateInCents ?? ''}
/>
