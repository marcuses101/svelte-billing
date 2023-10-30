<script>
	import { page } from '$app/stores';
	import BackButton from '$lib/components/BackButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import CoachForm from '../CoachForm.svelte';
	export let data;
	const { firstName, lastName } = data.coach;
	const toastMessage =
		firstName && lastName ? `${firstName} ${lastName} updated!` : 'Coach updated!';

	$: isEdit = $page.url.searchParams.get('edit') === 'true';
</script>

{#if $page.url.searchParams.get('success') === 'true'}
	<Toast>
		{toastMessage}
	</Toast>
{/if}

{#if isEdit}
	<PageHeader title="Edit Coach Info">
		<div class="flex gap-1">
			<a class="btn btn-outline btn-error" href={`/coaches/${$page.params.id}`}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-6 h-6"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
				Cancel
			</a>
			<BackButton href="/coaches">Back to Coaches</BackButton>
		</div>
	</PageHeader>
{:else}
	<PageHeader title="Coach Info">
		<div class="flex gap-1">
			<a class="btn btn-primary btn-outline" href={`/coaches/${$page.params.id}?edit=true`}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-6 h-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
					/>
				</svg>
				Edit</a
			>
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
