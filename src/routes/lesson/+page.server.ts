import { prisma } from '$lib/server/db';
import type { ServerLoad } from '@sveltejs/kit';
import type { Actions } from './$types';

export const load: ServerLoad = async ({ locals }) => {
	const coachId = locals.user?.Coach?.id;
	if (!coachId) {
		return { lessons: [] };
	}
	const lessons = await prisma.lesson.findMany({
		include: { skaters: { include: { Skater: true } } },
		where: { coachId }
	});
	return { lessons };
};

export const actions = {
	delete: async ({ request }) => {
		const data = await request.formData();
		const lessonId = data.get('id');
		const deleteSkaterLesson = prisma.skaterLesson.deleteMany({
			where: { lessonId: lessonId as string }
		});
		const deleteLesson = prisma.lesson.delete({ where: { id: lessonId as string } });
		const transaction = await prisma.$transaction([deleteSkaterLesson, deleteLesson]);
		console.log(transaction);
	}
} satisfies Actions;
