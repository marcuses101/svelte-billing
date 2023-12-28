<script lang="ts">
	import { page } from '$app/stores';
	import { format } from 'date-fns';
	import LessonForm from '../../create/LessonForm.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	export let data;

	const skaterOptions = data.skaters.map(({ id, firstName, lastName }) => ({
		value: id,
		label: `${firstName} ${lastName}`
	}));
	const selectedOptions = data.lesson.skaters.map(({ Skater: { id, firstName, lastName } }) => {
		return { value: id, label: `${firstName} ${lastName}` };
	});

	console.log(data);
	const date = format(data.lesson.date, 'yyyy-MM-dd');
	const minutes = data.lesson.lessonTimeInMinutes;
</script>

<PageHeader title="Lessons">
	<span slot="title-post">
		{' - '} <span>Edit </span>
	</span>
</PageHeader>
<LessonForm {skaterOptions} {selectedOptions} {date} {minutes} />
