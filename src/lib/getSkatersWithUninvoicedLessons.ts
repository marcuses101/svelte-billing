import { ACCOUNT_TRANSACTION_TYPE } from '$lib/defs';
import type { Prisma, PrismaClient } from '@prisma/client';
import { lastInvoiceQuery, calculateLessonQuery } from './server/db';

export function getSkatersWithUninvoicedLessons(tx: Prisma.TransactionClient | PrismaClient) {
	return tx.skater.findMany({
		include: {
			Invoices: lastInvoiceQuery,
			Account: {
				include: {
					AccountTransaction: {
						where: {
							accountTransactionTypeCode: ACCOUNT_TRANSACTION_TYPE.STUDENT_PAYMENT,
							PaymentRecordedInvoice: { is: null }
						}
					}
				}
			},
			SkaterLessons: {
				select: {
					Lesson: calculateLessonQuery
				},
				where: { InvoiceLineItems: { is: null } }
			},
			AdditionalCharges: {
				include: {
					coachPaySlipMiscellaneousItem: {
						include: {
							Coach: { include: { User: { select: { firstName: true, lastName: true } } } }
						}
					}
				},
				where: { SkaterInvoiceLineItem: { is: null } }
			}
		}
	});
}

export function getSkaterWithUnInvoicedLessonsById(
	tx: Prisma.TransactionClient | PrismaClient,
	id: string
) {
	return tx.skater.findUnique({
		where: { id },
		include: {
			Invoices: lastInvoiceQuery,
			Account: {
				include: {
					AccountTransaction: {
						where: {
							accountTransactionTypeCode: ACCOUNT_TRANSACTION_TYPE.STUDENT_PAYMENT,
							PaymentRecordedInvoice: { is: null }
						}
					}
				}
			},
			SkaterLessons: {
				select: {
					Lesson: calculateLessonQuery
				},
				where: { InvoiceLineItems: { is: null } }
			},
			AdditionalCharges: {
				include: {
					coachPaySlipMiscellaneousItem: {
						include: {
							Coach: { include: { User: { select: { firstName: true, lastName: true } } } }
						}
					}
				},
				where: { SkaterInvoiceLineItem: { is: null } }
			}
		}
	});
}
