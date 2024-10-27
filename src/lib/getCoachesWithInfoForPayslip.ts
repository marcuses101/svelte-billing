import { ACCOUNT_TRANSACTION_TYPE } from '$lib/defs';
import type { Prisma, PrismaClient } from '@prisma/client';

export function getCoachesWithInfoForPayslip(tx: Prisma.TransactionClient) {
	return tx.coach.findMany({
		include: {
			CoachRate: true,
			CoachPaySlips: { where: { NextCoachPaySlip: { is: null } }, take: 1 },
			Account: {
				include: {
					AccountTransaction: {
						where: {
							accountTransactionTypeCode: ACCOUNT_TRANSACTION_TYPE.COACH_PAYMENT,
							CoachPaymentPaySlip: { is: null }
						}
					}
				}
			},

			Lessons: {
				include: {
					SkaterLessons: { include: { Skater: { select: { id: true, skaterTypeCode: true } } } }
				},
				where: { CoachPaySlipLineItem: { is: null } }
			},
			CoachPaySlipMiscellaneousItem: {
				include: {
					skaterInvoiceMiscellaneousItem: {
						include: { Skater: { select: { lastName: true, firstName: true } } }
					}
				},
				where: { CoachPaySlipLineItem: { is: null } }
			}
		}
	});
}

export function getCoachWithInfoForPayslipById(
	tx: Prisma.TransactionClient | PrismaClient,
	id: string
) {
	return tx.coach.findUnique({
		where: { id },
		include: {
			CoachRate: true,
			CoachPaySlips: { where: { NextCoachPaySlip: { is: null } }, take: 1 },
			Account: {
				include: {
					AccountTransaction: {
						where: {
							accountTransactionTypeCode: ACCOUNT_TRANSACTION_TYPE.COACH_PAYMENT,
							CoachPaymentPaySlip: { is: null }
						}
					}
				}
			},
			Lessons: {
				include: {
					SkaterLessons: { include: { Skater: { select: { id: true, skaterTypeCode: true } } } }
				},
				where: { CoachPaySlipLineItem: { is: null } }
			},
			CoachPaySlipMiscellaneousItem: {
				include: {
					skaterInvoiceMiscellaneousItem: {
						include: { Skater: { select: { lastName: true, firstName: true } } }
					}
				},
				where: { CoachPaySlipLineItem: { is: null } }
			}
		}
	});
}
