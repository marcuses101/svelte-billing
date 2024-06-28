<script lang="ts">
	import type { SkaterType } from '$lib/defs';
	import { page } from '$app/stores';
	import BackButton from '$lib/components/BackButton.svelte';
	import CancelButton from '$lib/components/CancelButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import CoachForm from '../../CoachForm.svelte';
	import Toast from '$lib/components/Toast.svelte';

	export let data;
	export let form;

	const isSubmitError = Array.isArray(form?.missingFields) && form.missingFields.length > 0;
	if (isSubmitError) {
		console.dir(form);
	}

	const {
		User: { firstName, lastName, email },
		id,
		CoachRate,
		isHstCharged
	} = data.coach;

	const rates = CoachRate.reduce(
		(acc, { skaterTypeCode, hourlyRateInCents }) => {
			acc[skaterTypeCode as SkaterType] = hourlyRateInCents;
			return acc;
		},
		{} as Record<SkaterType, number>
	);
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

{#if isSubmitError}
	<Toast>Submit Error</Toast>
{/if}

<CoachForm
	showReset={false}
	firstName={firstName ?? ''}
	lastName={lastName ?? ''}
	email={email ?? ''}
	{rates}
	commissionPercentage={data.coach.commissionPercentage ?? 0}
	{isHstCharged}
/>
