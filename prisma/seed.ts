import util from 'util';
import { Account, Coach, Lesson, PrismaClient, Role, Skater } from '@prisma/client';
import {
	LEDGER_CODE,
	ACCOUNT_TYPE_CODE,
	ACCOUNT_TRANSACTION_TYPE,
	ROLES
} from '../src/lib/server/defs';
import { calculateLessonCost } from '../src/lib/calculateLessonCost';
import { generateBillingBatch } from '../src/lib/server/generateBillingBatch';

const prisma = new PrismaClient();

async function seedAccounting() {
	console.log('  Seeding accounting system');

	// set up ledgers
	const ledgers = await prisma.ledger.createMany({
		data: [
			{ code: LEDGER_CODE.ACCOUNTS_PAYABLE, name: 'Accounts Payable' },
			{ code: LEDGER_CODE.ACCOUNTS_RECEIVABLE, name: 'Accounts Receivable' },
			{ code: LEDGER_CODE.COMMISSION, name: 'Commission' },
			{ code: LEDGER_CODE.CASH, name: 'Cash' },
			{ code: LEDGER_CODE.BILLING_REVENUE, name: 'Billing Revenue' },
			{ code: LEDGER_CODE.COACH_INCOME, name: 'Coach Income' }
		]
	});

	const accountTypes = await prisma.accountType.createMany({
		data: [{ code: ACCOUNT_TYPE_CODE.STUDENT }, { code: ACCOUNT_TYPE_CODE.COACH }]
	});

	const accountTransactionTypes = await prisma.accountTransactionType.createMany({
		data: [
			{
				code: ACCOUNT_TRANSACTION_TYPE.STUDENT_CHARGE,
				type: 'Debit',
				accountTypeCode: ACCOUNT_TYPE_CODE.STUDENT,
				description: 'Student Charge'
			},
			{
				code: ACCOUNT_TRANSACTION_TYPE.STUDENT_PAYMENT,
				type: 'Credit',
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
	return { ledgers, accountTypes, accountTransactionTypes };
}

async function seedCoaches() {
	console.log('Seeding Coaches');
	const marcus = await prisma.user.upsert({
		where: { email: 'mnjconnolly@gmail.com' },
		update: { Coach: { update: { hourlyRateInCents: 3_800 } } },
		create: {
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
					hourlyRateInCents: 6_000,
					commissionPercentage: 0,
					Account: {
						create: {
							name: 'Marcus Connolly Coach Account',
							accountTypeCode: ACCOUNT_TYPE_CODE.COACH
						}
					}
				}
			}
		},
		include: { Coach: true }
	});

	const laurence = await prisma.user.upsert({
		where: { email: 'laurencelessard@gmail.com' },
		update: { Coach: { update: { hourlyRateInCents: 3_800 } } },
		create: {
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
					hourlyRateInCents: 3_800,
					commissionPercentage: 5,
					Account: {
						create: {
							name: 'Laurence Lessard Coach Account',
							accountTypeCode: ACCOUNT_TYPE_CODE.COACH
						}
					}
				}
			}
		},
		include: { Coach: true }
	});
	return [marcus, laurence];
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
		const skater = await prisma.skater.upsert({
			where: { firstName_lastName: { firstName: 'Skater', lastName: num } },
			update: {},
			create: {
				firstName: 'Skater',
				lastName: num,
				email: `skater_${num.toLowerCase()}@gmail.com`,
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
	lessonTimeInMinutes: number,
	skaterIds: { skaterId: string }[],
	date: string
) {
	const { hourlyRateInCents, id: coachId } = coach;
	const { lessonCostInCents, lessonCostPerSkaterInCents } = calculateLessonCost(
		lessonTimeInMinutes,
		hourlyRateInCents,
		skaterIds.length
	);
	const lesson = await prisma.lesson.create({
		data: {
			coachId,
			date: new Date(date).toISOString(),
			lessonTimeInMinutes,
			lessonCostInCents,
			lessonCostPerSkaterInCents,
			SkaterLessons: { createMany: { data: skaterIds } }
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
		const coach = coachUser.Coach!;
		const skaterIds: { skaterId: string }[] = skaters
			.slice(0, 3)
			.map((skater) => ({ skaterId: skater.id }));
		const lesson1 = await createLesson(coach, 60, skaterIds, '2024-02-01');
		const lesson2 = await createLesson(coach, 45, [{ skaterId: skaters.at(4)!.id }], '2024-02-07');
		const lesson3 = await createLesson(
			coach,
			90,
			skaters.slice(5).map(({ id }) => ({ skaterId: id })),
			'2024-03-01'
		);
		const lesson4 = await createLesson(
			coach,
			90,
			skaters.slice(3, 5).map(({ id }) => ({ skaterId: id })),
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
	if (batch.ok) {
		return batch.value;
	}
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
	const coaches = await seedCoaches();
	const skaters = await seedSkaters();
	const lessons = await seedLessons(skaters, coaches);
	const billingBatch = await seedBillingBatch();
	console.log(
		util.inspect(
			{
				ledgers,
				accountTypes,
				accountTransactionTypes,
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
