<script lang="ts">
	export let data;
	const dateFormat = new Intl.DateTimeFormat('en-CA', {
		weekday: 'long',
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	}).format;
	type FormattedLesson = {
		id: string;
		skaters: string;
		lessonTimeInMinutes: number;
		formattedDate: string;
	};

	const lessonsMap = data.lessons.reduce((acc, entry) => {
		const formattedDate = dateFormat(entry.date);
		const skaters = entry.skaters
			.map((skater) => {
				const fullName = `${skater.Skater.firstName} ${skater.Skater.lastName}`;
				return fullName;
			})
			.join(', ');
		const currentEntry = {
			id: entry.id,
			skaters,
			lessonTimeInMinutes: entry.lessonTimeInMinutes,
			formattedDate
		};
		if (!acc.has(formattedDate)) {
			acc.set(formattedDate, [currentEntry]);
			return acc;
		}
		const array = acc.get(formattedDate)!;
		array.push(currentEntry);
		return acc;
	}, new Map<string, FormattedLesson[]>());
	const groupedLessons = Array.from(lessonsMap.entries()).sort();
</script>

<h1>Lessons</h1>
<a href="/lesson/create">Add a lesson</a>
{#each groupedLessons as [date, lessons]}
	<h3>{date}</h3>
	<ul>
		{#each lessons as { skaters, lessonTimeInMinutes, id }}
			<form method="POST" action="?/delete">
				<input type="hidden" name="id" value={id} />
				<li>
					<section>
						<article>
							{lessonTimeInMinutes} minutes Skaters: {skaters}
						</article>
						<article>
							<a href={`/lesson/${id}/edit`}>
								<button type="button">Edit</button>
							</a>
							<button type="submit">x</button>
						</article>
					</section>
				</li>
			</form>
		{/each}
	</ul>
{/each}

<style>
	li {
		margin-block: 0.25rem;
	}
	section {
		display: flex;
	}
	article:first-of-type {
		flex: 1;
	}
</style>
