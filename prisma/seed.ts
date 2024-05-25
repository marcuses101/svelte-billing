import util from 'util';
import { Account, Coach, CoachRate, Lesson, PrismaClient, Role, Skater } from '@prisma/client';
import {
	LEDGER_CODE,
	ACCOUNT_TYPE_CODE,
	ACCOUNT_TRANSACTION_TYPE,
	ROLES,
	LEDGER_TYPE,
	SKATER_TYPE
} from '../src/lib/defs';
import { calculateLessonCost } from '../src/lib/calculateLessonCost';
import { generateBillingBatch } from '../src/lib/server/generateBillingBatch';

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
	const marcus = await prisma.user.create({
		data: {
			email: 'mnjconnolly@gmail.com',
			firstName: 'Marcus',
			lastName: 'Connolly',
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
					commissionPercentage: 0,
					CoachRate: {
						createMany: {
							data: [
								{ skaterTypeCode: SKATER_TYPE.RESIDENT, hourlyRateInCents: 60_000 },
								{ skaterTypeCode: SKATER_TYPE.US, hourlyRateInCents: 70_000 },
								{ skaterTypeCode: SKATER_TYPE.INTERNATIONAL, hourlyRateInCents: 120_000 }
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
					commissionPercentage: 10,
					CoachRate: {
						createMany: {
							data: [
								{ skaterTypeCode: SKATER_TYPE.RESIDENT, hourlyRateInCents: 40_000 },
								{ skaterTypeCode: SKATER_TYPE.US, hourlyRateInCents: 50_000 },
								{ skaterTypeCode: SKATER_TYPE.INTERNATIONAL, hourlyRateInCents: 60_000 }
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
	return [marcus, laurence];
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
	const numbers = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];

	const skaters: SkaterEntry[] = [];
	for (const num of numbers) {
		const skater = await prisma.skater.create({
			data: {
				firstName: 'Skater',
				lastName: num,
				email: `skater_${num.toLowerCase()}@gmail.com`,
				SkaterType: { connect: { code: SKATER_TYPE.RESIDENT } },
				Account: {
					create: {
						accountTypeCode: ACCOUNT_TYPE_CODE.STUDENT,
						name: `Skater ${num} Client Account`
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
	coachRates: CoachRate[],
	lessonTimeInMinutes: number,
	skaters: { skaterId: string; skaterTypeCode: string }[],
	date: string
) {
	const { id: coachId } = coach;
	const { lessonCostInCents } = calculateLessonCost(lessonTimeInMinutes, coachRates, skaters);
	const lesson = await prisma.lesson.create({
		data: {
			coachId,
			date: new Date(date).toISOString(),
			lessonTimeInMinutes,
			lessonCostInCents,
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
		const lesson1 = await createLesson(coach, CoachRate, 60, skaterIds, '2024-02-01');
		const lesson2 = await createLesson(
			coach,
			CoachRate,
			45,
			[{ skaterId: skaters.at(4)!.id, skaterTypeCode: skaters.at(4)?.skaterTypeCode! }],
			'2024-02-07'
		);
		const lesson3 = await createLesson(
			coach,
			CoachRate,
			90,
			skaters.slice(5).map(({ id, skaterTypeCode }) => ({ skaterId: id, skaterTypeCode })),
			'2024-03-01'
		);
		const lesson4 = await createLesson(
			coach,
			CoachRate,
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
	console.log(
		util.inspect(
			{
				ledgers,
				accountTypes,
				accountTransactionTypes,
				skaterTypes,
				coaches,
				skaters,
				roles,
				lessons,
				billingBatch
			},
			false,
			null,
			true /* enable colors */
		)
	);
	console.log('Seeding complete');
}

await main();
