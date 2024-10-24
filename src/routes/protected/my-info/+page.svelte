<script lang="ts">
	import CoachForm from '$lib/components/CoachForm.svelte';
	import type { SkaterType } from '$lib/defs.js';

	let { data } = $props();
	const { firstName, lastName, email } = data.coach.User;
	const { isHstCharged } = data.coach;
	const rates = data.coach.CoachRate.reduce(
		(acc, { skaterTypeCode, hourlyRateInCents }) => {
			acc[skaterTypeCode as SkaterType] = hourlyRateInCents;
			return acc;
		},
		{} as Record<SkaterType, number>
	);
</script>

<CoachForm
	disabled={true}
	firstName={firstName ?? ''}
	lastName={lastName ?? ''}
	email={email ?? ''}
	{rates}
	commissionPercentage={data.coach.commissionPercentage ?? 0}
	{isHstCharged}
/>
