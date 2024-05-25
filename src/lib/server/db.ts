import { PrismaClient } from '@prisma/client';
import { ACCOUNT_TYPE_CODE, type SkaterType } from '../defs';
export const prisma = new PrismaClient();

export function getCoachById(id: string) {
	return prisma.coach.findUnique({
		where: { id },
		include: { User: true }
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

export async function addSkater(
	firstName: string,
	lastName: string,
	email: string,
	skaterTypeCode: SkaterType
) {
	return prisma.skater.create({
		data: {
			firstName,
			lastName,
			email,
			SkaterType: { connect: { code: skaterTypeCode } },
			Account: {
				create: {
					name: `${firstName} ${lastName}`,
					accountTypeCode: ACCOUNT_TYPE_CODE.STUDENT
				}
			}
		}
	});
}
