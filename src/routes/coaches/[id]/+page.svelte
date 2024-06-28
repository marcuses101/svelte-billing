<script lang="ts">
	import { page } from '$app/stores';
	import BackButton from '$lib/components/BackButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import PencilIcon from '$lib/icons/PencilIcon.svelte';
	import CoachForm from '../CoachForm.svelte';
	import type { SkaterType } from '$lib/defs';

	export let data;
	const { firstName, lastName, email } = data.coach.User;
	const { isHstCharged } = data.coach;
	const rates = data.coach.CoachRate.reduce(
		(acc, { skaterTypeCode, hourlyRateInCents }) => {
			acc[skaterTypeCode as SkaterType] = hourlyRateInCents;
			return acc;
		},
		{} as Record<SkaterType, number>
	);
	const fullName = `${firstName} ${lastName}`;
	const toastMessage = firstName && lastName ? `${fullName} updated!` : 'Coach updated!';
</script>

{#if $page.url.searchParams.get('success') === 'true'}
	<Toast>
		{toastMessage}
	</Toast>
{/if}

<PageHeader title="Coach Info">
	<span slot="title-pre" style={`--transition-name:coach-${data.coach.id}`}>
		<span class="[view-transition-name:var(--transition-name)]">{fullName}</span>{' - '}
	</span>
	<div class="flex gap-1">
		<a class="btn btn-primary btn-outline" href={`/coaches/${$page.params.id}/edit`}>
			<PencilIcon />
			Edit
		</a>
		<BackButton href="/coaches">Back to Coaches</BackButton>
	</div>
</PageHeader>

<CoachForm
	disabled={true}
	firstName={firstName ?? ''}
	lastName={lastName ?? ''}
	email={email ?? ''}
	{rates}
	commissionPercentage={data.coach.commissionPercentage ?? 0}
	{isHstCharged}
/>
