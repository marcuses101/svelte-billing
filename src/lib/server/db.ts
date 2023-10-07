import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();

export function getSkaters() {
	return prisma.skater.findMany();
}

export function getSkaterById(id: string) {
	return prisma.skater.findUnique({ where: { id } });
}

export async function addSkater(firstName: string, lastName: string, email: string) {
	return prisma.skater.create({ data: { firstName, lastName, email } });
}
