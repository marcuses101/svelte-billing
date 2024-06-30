<script lang="ts">
	import { page } from '$app/stores';
	import Toast from '$lib/components/Toast.svelte';
	import CoachForm from '$lib/components/CoachForm.svelte';
	import type { SkaterType } from '$lib/defs';
	import EditButton from '$lib/components/EditButton.svelte';

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

<CoachForm
	disabled={true}
	firstName={firstName ?? ''}
	lastName={lastName ?? ''}
	email={email ?? ''}
	{rates}
	commissionPercentage={data.coach.commissionPercentage ?? 0}
	{isHstCharged}
>
	<EditButton href={`/coaches/${data.coach.id}/edit`} />
</CoachForm>
