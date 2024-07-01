<script lang="ts">
	import type { SkaterType } from '$lib/defs';
	import CoachForm from '$lib/components/CoachForm.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import CancelButton from '$lib/components/CancelButton.svelte';
	import SubmitButton from '$lib/components/SubmitButton.svelte';

	export let data;
	export let form;

	const isSubmitError = Array.isArray(form?.missingFields) && form.missingFields.length > 0;
	if (isSubmitError) {
		console.dir(form);
	}

	const {
		User: { firstName, lastName, email },
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
</script>

{#if isSubmitError}
	<Toast>Submit Error</Toast>
{/if}

<CoachForm
	firstName={firstName ?? ''}
	lastName={lastName ?? ''}
	email={email ?? ''}
	{rates}
	commissionPercentage={data.coach.commissionPercentage ?? 0}
	{isHstCharged}
>
	<div class="flex gap-2 flex-row">
		<CancelButton href={`/coaches/${data.coach.id}`} />
		<SubmitButton />
	</div>
</CoachForm>
