import { prisma } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const lessons = await prisma.lesson.findMany({
		where: { coachId: params.id, CoachPaySlipLineItem: { is: null } },
		include: { SkaterLessons: true }
	});
	return { lessons };
};
