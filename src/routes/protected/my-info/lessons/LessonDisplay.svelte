<script lang="ts">
	import EditButton from '$lib/components/EditButton.svelte';
	import CancelIcon from '$lib/icons/CancelIcon.svelte';

	interface Props {
		lessonTimeInMinutes: number;
		skaters: string[];
		id: string;
	}

	let { lessonTimeInMinutes, skaters, id }: Props = $props();
</script>

<article class="flex gap-4 rounded-xl shadow px-2 py-0 border border-neutral-400">
	<article class="flex flex-col items-center">
		<div class="stat-title">Minutes</div>
		<div class="stat-value">{lessonTimeInMinutes}</div>
	</article>
	<article class="flex flex-col flex-1 gap-2">
		<div class="stat-title ps-2">Skater(s)</div>
		<div class="flex flex-wrap gap-1 mb-1">
			{#each skaters as skater}
				<div class="badge badge-ghost min-w-fit">{skater}</div>
			{/each}
			<div></div>
		</div>
	</article>
	<article class="flex self-center gap-2">
		<EditButton href={`/lessons/${id}/edit`} size="sm" />
		<form method="POST" action="?/delete">
			<input type="hidden" name="id" value={id} />
			<button class="btn btn-xs btn-circle btn-outline btn-error" type="submit"
				><CancelIcon /></button
			>
		</form>
	</article>
</article>
