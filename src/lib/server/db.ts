import { PrismaClient } from '@prisma/client';
import { ACCOUNT_TYPE_CODE } from './defs';
export const prisma = new PrismaClient();

export function getCurrentCoachUser() {
	return prisma.user.findUnique({
		where: { email: 'mnjconnolly@gmail.com' },
		include: { Coach: true }
	});
}

export async function getPayslipById(id: string) {
	const paySlip = await prisma.coachPaySlip.findUnique({
		where: { id },
		include: {
			CoachPaySlipLineItems: true,
			CoachPaymentAccountTransactions: true,
			Coach: { include: { User: true } }
		}
	});
	return paySlip;
}

export type PaySlipData = Exclude<Awaited<ReturnType<typeof getPayslipById>>, null>;

export function getSkaters() {
	return prisma.skater.findMany({ orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }] });
}

export function getSkaterById(id: string) {
	return prisma.skater.findUnique({ where: { id } });
}

export async function addSkater(firstName: string, lastName: string, email: string) {
	return prisma.skater.create({
		data: {
			firstName,
			lastName,
			email,
			Account: {
				create: {
					name: `${firstName} ${lastName}`,
					accountTypeCode: ACCOUNT_TYPE_CODE.STUDENT
				}
			}
		}
	});
}
