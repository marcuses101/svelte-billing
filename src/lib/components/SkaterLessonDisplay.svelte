<script lang="ts">
	export let coachName: string;
	export let type: 'private' | 'group';
	export let lessonTimeInMinutes: number;
	export let lessonCharge: string;
</script>

<article
	class="
        grid
        grid-cols-[10ch_1fr]
        grid-rows-4
        grid-flow-row
        gap-x-4
        sm:grid-flow-col
        sm:grid-cols-4
        sm:grid-rows-[auto_auto]
        rounded-xl
        shadow
        border
        border-neutral-400
        py-2
        px-4"
>
	<div class="text-neutral-500">Coach</div>
	<div class="text-xl">{coachName}</div>
	<div class="text-neutral-500">Type</div>
	<div class="text-xl uppercase">{type}</div>
	<div class="text-neutral-500">Minutes</div>
	<div class="text-xl">{lessonTimeInMinutes}</div>
	<div class="text-neutral-500">Charge</div>
	<div class="text-xl">{lessonCharge}</div>
</article>
