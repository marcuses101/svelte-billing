export const ACCOUNT_TYPE_CODE = {
	STUDENT: 'STUDENT',
	COACH: 'COACH'
} as const;

export const SKATER_TYPE = {
	RESIDENT: 'RESIDENT',
	US: 'US',
	INTERNATIONAL: 'INTERNATIONAL'
} as const;

export type SkaterType = (typeof SKATER_TYPE)[keyof typeof SKATER_TYPE];

export const ACCOUNT_TRANSACTION_TYPE = {
	STUDENT_CHARGE: 'STUDENT_CHARGE',
	STUDENT_PAYMENT: 'STUDENT_PAYMENT',
	COACH_CHARGE: 'COACH_CHARGE',
	COACH_PAYMENT: 'COACH_PAYMENT'
} as const;

export const LEDGER_TYPE = {
	ASSET: 'ASSET',
	REVENUE: 'REVENUE',
	EXPENSE: 'EXPENSE',
	LIABILITY: 'LIABILITY',
	EQUITY: 'EQUITY'
} as const;

export type LedgerType = (typeof LEDGER_TYPE)[keyof typeof LEDGER_TYPE];

export const LEDGER_CODE = {
	ACCOUNTS_PAYABLE: 'ACCOUNTS_PAYABLE',
	ACCOUNTS_RECEIVABLE: 'ACCOUNTS_RECEIVABLE',
	INVOICING_HST: 'INVOICING_HST',
	COACH_HST: 'COACH_HST',
	INVOICING: 'INVOICING',
	COMMISSION: 'COMMISSION',
	CASH: 'CASH'
} as const;

export type LedgerCode = (typeof LEDGER_CODE)[keyof typeof LEDGER_CODE];

export const ROLES = {
	ADMIN: 'ADMIN',
	COACH: 'COACH',
	CLIENT: 'CLIENT'
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
