<script lang="ts">
	import StyledTable from '$lib/components/StyledTable.svelte';
	import { formatDate } from '$lib/formatDate';

	let { data } = $props();
	const formatter = new Intl.NumberFormat('en-CA', {
		unit: 'minute',
		style: 'unit',
		unitDisplay: 'long'
	}).format;
</script>

<StyledTable>
	{#snippet head()}
		<tr >
			<th>Date</th>
			<th class="text-right">Lesson time</th>
			<th class="text-right">Skater Count</th>
		</tr>
	{/snippet}

	{#each data.lessons as lesson}
		<tr>
			<td>{formatDate(lesson.date)}</td>
			<td class="text-right">{formatter(lesson.lessonTimeInMinutes)}</td>
			<td class="text-right">{lesson.SkaterLessons.length}</td>
		</tr>
	{:else}
		<tbody>
			<tr>
				<td>No un-invoiced lessons</td>
			</tr>
		</tbody>
	{/each}
</StyledTable>
