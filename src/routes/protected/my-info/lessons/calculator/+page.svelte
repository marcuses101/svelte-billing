<script lang="ts">
	import { calculateLessonCost } from '$lib/calculateLessonCost';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { SKATER_TYPE, type SkaterType } from '$lib/defs';
	import { formatCurrency } from '$lib/formatCurrency';

	const COACH_ID = 'CoachId';
	let nextId = 1;
	let minutes: number = 60;
	let coachRates = Object.values(SKATER_TYPE).map((type) => ({
		coachId: COACH_ID,
		hourlyRateInCents: 60_00,
		skaterTypeCode: type
	}));

	let skaters: { skaterId: string; skaterTypeCode: SkaterType }[] = [];
	const types = Object.values(SKATER_TYPE);
	let selectedType = types[0];

	function createSkater(type: SkaterType) {
		skaters = [...skaters, { skaterId: `Skater_${nextId}_${type}`, skaterTypeCode: type }];
		nextId += 1;
	}
	function removeSkater(skaterId: string) {
		skaters = skaters.filter((skater) => skater.skaterId !== skaterId);
	}
	let lessonCostInfo: ReturnType<typeof calculateLessonCost> | null = null;

	$: try {
		lessonCostInfo = calculateLessonCost(minutes, coachRates, skaters);
	} catch {
		lessonCostInfo = null;
	}
</script>

<PageHeader title="Lesson Calculator" />

<div class="flex flex-col gap-4">
	<div class="flex flex-row gap-4 flex-wrap">
		<section class="card bg-base-100 shadow-xl border border-primary">
			<div class="card-body">
				<h2 class="text-lg">Coach Info</h2>
				{#each coachRates as rate}
					<div class="form-control w-full max-w-xs">
						<label class="label" for="hourly-rate-in-cents">
							<span class="label-text">{rate.skaterTypeCode} Rate in cents</span>
						</label>
						<input
							id={`rate_${rate.skaterTypeCode}`}
							type="number"
							bind:value={rate.hourlyRateInCents}
							step="5"
							min="0"
							name={`rate_${rate.skaterTypeCode}`}
							placeholder="60"
							class="input input-bordered w-full max-w-xs"
						/>
					</div>
				{/each}
			</div>
		</section>
		<section class="card bg-base-100 shadow-xl border border-primary">
			<div class="card-body">
				<h2 class="text-lg">Lesson Info</h2>
				<div class="form-control w-full max-w-xs">
					<label class="label" for="time-in-minutes">
						<span class="label-text">Lesson minutes</span>
					</label>
					<input
						id="time-in-minutes"
						type="number"
						bind:value={minutes}
						step="5"
						min="0"
						name="time-in-minutes"
						placeholder="60"
						class="input input-bordered w-full max-w-xs"
					/>
				</div>
				<label class="form-control w-full max-w-xs">
					<div class="label">
						<span class="label-text">Add Skater of type</span>
					</div>
					<div class="flex flex-row gap-4 items-center">
						<select bind:value={selectedType} class="select select-bordered w-full max-w-xs">
							{#each types as type}
								<option value={type}>{type}</option>
							{/each}
						</select>
						<button
							class="btn btn-circle btn-sm"
							on:click={() => {
								if (!selectedType) {
									return;
								}
								createSkater(selectedType);
							}}
						>
							+
						</button>
					</div>
				</label>

				<ul class="list-disc">
					{#each skaters as skater}
						<li>
							{skater.skaterId}
							<button
								class="btn btn-circle btn-sm"
								on:click={() => {
									removeSkater(skater.skaterId);
								}}
							>
								X
							</button>
						</li>
					{/each}
				</ul>
			</div>
		</section>
	</div>
	{#if lessonCostInfo !== null}
		<div class="card bg-neutral text-neutral-content shadow-xl">
			<div class="card-body">
				<p>Lessons Cost Lesson Cost: {formatCurrency(lessonCostInfo.lessonCostInCents)}</p>
				<p>Hourly Surplus Amount: {formatCurrency(lessonCostInfo.hourlySurplusInCents)}</p>
				{#if lessonCostInfo.skatersWithCost.length > 0}
					Charge per Skater:
					<ul class="list-disc ml-8">
						{#each lessonCostInfo.skatersWithCost as skaterInfo}
							<li>{skaterInfo.skaterId}: {formatCurrency(skaterInfo.amountInCents)}</li>
						{/each}
					</ul>
				{/if}
			</div>
		</div>
	{/if}
</div>
