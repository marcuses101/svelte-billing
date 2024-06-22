import { prisma } from '$lib/server/db';
import { redirect, type ServerLoad } from '@sveltejs/kit';
import type { Actions } from './$types';

export const load: ServerLoad = async ({ locals }) => {
	const session = await locals.auth();
	if (!session) {
		return redirect(303, '/login');
	}
	const user = session.user;
	const coachId = user?.Coach?.id;
	if (!coachId) {
		return { lessons: [] };
	}
	const lessons = await prisma.lesson.findMany({
		include: { SkaterLessons: { include: { Skater: true } } },
		where: { coachId, CoachPaySlipLineItem: { is: null } }
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
		await prisma.$transaction([deleteSkaterLesson, deleteLesson]);
	}
} satisfies Actions;
