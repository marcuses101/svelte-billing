import { Account, Coach, Lesson, PrismaClient, Role, Skater } from '@prisma/client';
import {
	LEDGER_CODE,
	ACCOUNT_TYPE_CODE,
	ACCOUNT_TRANSACTION_TYPE,
	ROLES,
	LEDGER_TYPE,
	SKATER_TYPE
} from '../src/lib/defs';
import { generateBillingBatch } from '../src/lib/server/generateBillingBatch';
import { config } from 'dotenv';
import { hash } from 'bcrypt';

config({ path: './prisma/.env' });

const defaultPassword = process.env.DEFAULT_PASSWORD;
if (typeof defaultPassword !== 'string') {
	throw new Error('DEFAULT_PASSWORD environment variable not configured');
}

const prisma = new PrismaClient();

async function seedAccounting() {
	console.log('  Seeding accounting system');

	const ledgerTypes = await prisma.ledgerType.createMany({
		data: [
			{ code: LEDGER_TYPE.ASSET, positiveTransactionType: 'Debit' },
			{ code: LEDGER_TYPE.EXPENSE, positiveTransactionType: 'Debit' },
			{ code: LEDGER_TYPE.EQUITY, positiveTransactionType: 'Credit' },
			{ code: LEDGER_TYPE.REVENUE, positiveTransactionType: 'Credit' },
			{ code: LEDGER_TYPE.LIABILITY, positiveTransactionType: 'Credit' }
		]
	});

	// set up ledgers
	const ledgers = await prisma.ledger.createMany({
		data: [
			{
				code: LEDGER_CODE.ACCOUNTS_RECEIVABLE,
				name: 'Accounts Receivable',
				ledgerTypeCode: LEDGER_TYPE.ASSET
			},
			{
				code: LEDGER_CODE.INVOICING,
				name: 'Invoicing Liability',
				ledgerTypeCode: LEDGER_TYPE.LIABILITY
			},
			{
				code: LEDGER_CODE.ACCOUNTS_PAYABLE,
				name: 'Accounts Payable',
				ledgerTypeCode: LEDGER_TYPE.LIABILITY
			},
			{
				code: LEDGER_CODE.INVOICING_HST,
				name: 'Invoicing HST',
				ledgerTypeCode: LEDGER_TYPE.LIABILITY
			},
			{
				code: LEDGER_CODE.COACH_HST,
				name: 'Coach HST',
				ledgerTypeCode: LEDGER_TYPE.LIABILITY
			},
			{ code: LEDGER_CODE.CASH, name: 'Cash', ledgerTypeCode: LEDGER_TYPE.ASSET },
			{
				code: LEDGER_CODE.COMMISSION,
				name: 'Commission Revenue',
				ledgerTypeCode: LEDGER_TYPE.REVENUE
			}
		]
	});

	const accountTypes = await prisma.accountType.createMany({
		data: [{ code: ACCOUNT_TYPE_CODE.STUDENT }, { code: ACCOUNT_TYPE_CODE.COACH }]
	});

	const accountTransactionTypes = await prisma.accountTransactionType.createMany({
		data: [
			{
				code: ACCOUNT_TRANSACTION_TYPE.STUDENT_CHARGE,
				type: 'Credit',
				accountTypeCode: ACCOUNT_TYPE_CODE.STUDENT,
				description: 'Student Charge'
			},
			{
				code: ACCOUNT_TRANSACTION_TYPE.STUDENT_PAYMENT,
				type: 'Debit',
				accountTypeCode: ACCOUNT_TYPE_CODE.STUDENT,
				description: 'Student Payment'
			},
			{
				code: ACCOUNT_TRANSACTION_TYPE.COACH_CHARGE,
				type: 'Debit',
				accountTypeCode: ACCOUNT_TYPE_CODE.COACH,
				description: 'Coach Charge'
			},
			{
				code: ACCOUNT_TRANSACTION_TYPE.COACH_PAYMENT,
				type: 'Credit',
				accountTypeCode: ACCOUNT_TYPE_CODE.COACH,
				description: 'Coach Payment'
			}
		]
	});

	console.log('  Seeding accounting system complete');
	return { ledgerTypes, ledgers, accountTypes, accountTransactionTypes };
}

async function seedCoaches() {
	console.log('Seeding Coaches');
	if (typeof defaultPassword !== 'string') {
		throw new Error('invalid DEFAULT_PASSWORD');
	}
	const marcus = await prisma.user.create({
		data: {
			email: 'mnjconnolly@gmail.com',
			firstName: 'Marcus',
			lastName: 'Connolly',
			hashedPassword: await hash(defaultPassword, 10),
			UserRoles: {
				create: [
					{
						roleName: ROLES.ADMIN
					},
					{ roleName: ROLES.COACH }
				]
			},
			Coach: {
				create: {
					isHstCharged: true,
					commissionPercentage: 0,
					CoachRate: {
						createMany: {
							data: [
								{ skaterTypeCode: SKATER_TYPE.RESIDENT, hourlyRateInCents: 60_00 },
								{ skaterTypeCode: SKATER_TYPE.US, hourlyRateInCents: 70_00 },
								{ skaterTypeCode: SKATER_TYPE.INTERNATIONAL, hourlyRateInCents: 120_00 }
							]
						}
					},
					Account: {
						create: {
							name: 'Marcus Connolly Coach Account',
							accountTypeCode: ACCOUNT_TYPE_CODE.COACH
						}
					}
				}
			}
		},
		include: { Coach: { include: { CoachRate: true } } }
	});

	const laurence = await prisma.user.create({
		data: {
			email: 'laurencelessard@gmail.com',
			firstName: 'Laurence',
			lastName: 'Lessard',
			hashedPassword: await hash(defaultPassword, 10),
			UserRoles: {
				create: [
					{
						roleName: ROLES.ADMIN
					},
					{ roleName: ROLES.COACH }
				]
			},
			Coach: {
				create: {
					isHstCharged: true,
					commissionPercentage: 10,
					CoachRate: {
						createMany: {
							data: [
								{ skaterTypeCode: SKATER_TYPE.RESIDENT, hourlyRateInCents: 40_00 },
								{ skaterTypeCode: SKATER_TYPE.US, hourlyRateInCents: 50_00 },
								{ skaterTypeCode: SKATER_TYPE.INTERNATIONAL, hourlyRateInCents: 60_00 }
							]
						}
					},
					Account: {
						create: {
							name: 'Laurence Lessard Coach Account',
							accountTypeCode: ACCOUNT_TYPE_CODE.COACH
						}
					}
				}
			}
		},
		include: { Coach: { include: { CoachRate: true } } }
	});
	const exampleCoach = await prisma.user.create({
		data: {
			email: 'example_coach@gmail.com',
			firstName: 'Coachy',
			lastName: 'Coacherson',
			hashedPassword: await hash(defaultPassword, 10),
			UserRoles: {
				create: [{ roleName: ROLES.COACH }]
			},
			Coach: {
				create: {
					isHstCharged: true,
					commissionPercentage: 10,
					CoachRate: {
						createMany: {
							data: [
								{ skaterTypeCode: SKATER_TYPE.RESIDENT, hourlyRateInCents: 40_00 },
								{ skaterTypeCode: SKATER_TYPE.US, hourlyRateInCents: 50_00 },
								{ skaterTypeCode: SKATER_TYPE.INTERNATIONAL, hourlyRateInCents: 60_00 }
							]
						}
					},
					Account: {
						create: {
							name: 'Coachy Coacherson Coach Account',
							accountTypeCode: ACCOUNT_TYPE_CODE.COACH
						}
					}
				}
			}
		},
		include: { Coach: { include: { CoachRate: true } } }
	});
	return [marcus, laurence, exampleCoach];
}
async function seedSkaterType() {
	console.log('Seed Skater Types');
	await prisma.skaterType.createMany({
		data: [
			{ code: SKATER_TYPE.RESIDENT },
			{ code: SKATER_TYPE.US },
			{ code: SKATER_TYPE.INTERNATIONAL }
		]
	});
}

type SkaterEntry = Skater & { Account: Account };
/**
 * Creates and returns 10 skaters
 * */
async function seedSkaters() {
	console.log('Seed Skaters');
	const skaterInput = [
		{ name: 'Abby', code: SKATER_TYPE.RESIDENT },
		{ name: 'Brenda', code: SKATER_TYPE.RESIDENT },
		{ name: 'Caroline', code: SKATER_TYPE.RESIDENT },
		{ name: 'Evan', code: SKATER_TYPE.US },
		{ name: 'Fiona', code: SKATER_TYPE.US },
		{ name: 'Gertrude', code: SKATER_TYPE.US },
		{ name: 'Hilda', code: SKATER_TYPE.INTERNATIONAL },
		{ name: 'Ilia', code: SKATER_TYPE.INTERNATIONAL },
		{ name: 'James', code: SKATER_TYPE.INTERNATIONAL },
		{ name: 'Xavier', code: SKATER_TYPE.INTERNATIONAL }
	];

	const skaters: SkaterEntry[] = [];
	for (const { name, code } of skaterInput) {
		const skater = await prisma.skater.create({
			data: {
				firstName: 'Skater',
				lastName: name,
				email: `skater_${name.toLowerCase()}@gmail.com`,
				SkaterType: { connect: { code } },
				Account: {
					create: {
						accountTypeCode: ACCOUNT_TYPE_CODE.STUDENT,
						name: `Skater ${name} Client Account`
					}
				}
			},
			include: { Account: true }
		});
		skaters.push(skater);
	}
	console.log('Seed Skaters Complete');
	return skaters;
}

async function createLesson(
	coach: Coach,
	lessonTimeInMinutes: number,
	skaters: { skaterId: string; skaterTypeCode: string }[],
	date: string
) {
	const { id: coachId } = coach;
	const lesson = await prisma.lesson.create({
		data: {
			coachId,
			date: new Date(date).toISOString(),
			lessonTimeInMinutes,
			SkaterLessons: {
				createMany: { data: skaters.map((skater) => ({ skaterId: skater.skaterId })) }
			}
		}
	});
	return lesson;
}

async function seedLessons(
	skaters: Awaited<ReturnType<typeof seedSkaters>>,
	coaches: Awaited<ReturnType<typeof seedCoaches>>
) {
	const lessons: Lesson[] = [];
	for (const coachUser of coaches) {
		const { CoachRate, ...coach } = coachUser.Coach!;
		const skaterIds: { skaterId: string; skaterTypeCode: string }[] = skaters
			.slice(0, 3)
			.map((skater) => ({ skaterId: skater.id, skaterTypeCode: skater.skaterTypeCode }));
		const lesson1 = await createLesson(coach, 60, skaterIds, '2024-02-01');
		const lesson2 = await createLesson(
			coach,
			45,
			[{ skaterId: skaters.at(4)!.id, skaterTypeCode: skaters.at(4)?.skaterTypeCode! }],
			'2024-02-07'
		);
		const lesson3 = await createLesson(
			coach,
			90,
			skaters.slice(5).map(({ id, skaterTypeCode }) => ({ skaterId: id, skaterTypeCode })),
			'2024-03-01'
		);
		const lesson4 = await createLesson(
			coach,
			90,
			skaters.slice(3, 5).map(({ id, skaterTypeCode }) => ({ skaterId: id, skaterTypeCode })),
			'2024-03-20'
		);
		lessons.push(lesson1);
		lessons.push(lesson2);
		lessons.push(lesson3);
		lessons.push(lesson4);
	}
	return lessons;
}

async function seedBillingBatch() {
	const batch = await generateBillingBatch();
	/*
	if (batch.ok) {
		return batch.value;
	}
    */
	return batch;
}
async function seedRoles() {
	console.log('  Seeding Roles');
	const roles: Role[] = [];
	for (const roleName of Object.values(ROLES)) {
		const role = await prisma.role.upsert({
			where: { name: roleName },
			create: { name: roleName },
			update: {}
		});
		roles.push(role);
	}
	console.log('  Seeding Roles -- Complete');
	return roles;
}

async function main() {
	console.log('Seeding beginning');
	const roles = await seedRoles();
	const { ledgers, accountTypes, accountTransactionTypes } = await seedAccounting();
	const skaterTypes = await seedSkaterType();
	const skaters = await seedSkaters();
	const coaches = await seedCoaches();
	const lessons = await seedLessons(skaters, coaches);
	const billingBatch = await seedBillingBatch();
	console.log('Seeding complete');
}

await main();
