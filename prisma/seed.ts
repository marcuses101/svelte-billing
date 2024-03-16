import { PrismaClient } from '@prisma/client';
import { LEDGER_CODE, ACCOUNT_TYPE_CODE } from '../src/lib/server/defs';
const prisma = new PrismaClient();

async function seedAccounting() {
	console.log('  Seeding accounting system');

	// set up ledgers
	const ledgers = await prisma.ledger.createMany({
		data: [
			{ code: LEDGER_CODE.ACCOUNTS_PAYABLE, name: 'Accounts Payable' },
			{ code: LEDGER_CODE.ACCOUNTS_RECEIVABLE, name: 'Accounts Receivable' },
			{ code: LEDGER_CODE.COMMISSION, name: 'Commission' },
			{ code: LEDGER_CODE.CASH, name: 'Cash' }
		]
	});

	const accountTypes = await prisma.accountType.createMany({
		data: [{ code: ACCOUNT_TYPE_CODE.STUDENT }, { code: ACCOUNT_TYPE_CODE.COACH }]
	});

	const accounts = await prisma.account.createMany({
		data: [
			// Student Accounts
			{ name: 'Student 1', accountTypeCode: ACCOUNT_TYPE_CODE.COACH },
			{ name: 'Student 2', accountTypeCode: ACCOUNT_TYPE_CODE.STUDENT },
			{ name: 'Student 3', accountTypeCode: ACCOUNT_TYPE_CODE.STUDENT },
			{ name: 'Student 4', accountTypeCode: ACCOUNT_TYPE_CODE.STUDENT },
			{ name: 'Student 5', accountTypeCode: ACCOUNT_TYPE_CODE.STUDENT },
			{ name: 'Student 6', accountTypeCode: ACCOUNT_TYPE_CODE.STUDENT },
			{ name: 'Student 7', accountTypeCode: ACCOUNT_TYPE_CODE.STUDENT },
			{ name: 'Student 8', accountTypeCode: ACCOUNT_TYPE_CODE.STUDENT },
			{ name: 'Student 9', accountTypeCode: ACCOUNT_TYPE_CODE.STUDENT },
			{ name: 'Student 10', accountTypeCode: ACCOUNT_TYPE_CODE.STUDENT },
			// Coach Accounts
			{ name: 'Coach 1', accountTypeCode: ACCOUNT_TYPE_CODE.COACH },
			{ name: 'Coach 2', accountTypeCode: ACCOUNT_TYPE_CODE.COACH },
			{ name: 'Coach 3', accountTypeCode: ACCOUNT_TYPE_CODE.COACH }
		]
	});

	console.log({ ledgers, accounts, accountTypes });
	// set up account types
	console.log('  Seeding accounting system complete');
}

async function main() {
	console.log('Seeding beginning');
	console.log('  Seeding Roles');
	const adminRole = await prisma.role.upsert({
		where: { name: 'admin' },
		create: { name: 'admin' },
		update: {}
	});
	const clientRole = await prisma.role.upsert({
		where: { name: 'client' },
		create: { name: 'client' },
		update: {}
	});

	const coachRole = await prisma.role.upsert({
		where: { name: 'coach' },
		create: { name: 'coach' },
		update: {}
	});
	console.log('  Seeding Roles -- Complete');

	console.log('  Seeding Users');
	const marcus = await prisma.user.upsert({
		where: { email: 'mnjconnolly@gmail.com' },
		update: { Coach: { update: { hourlyRateInCents: 6_000 } } },
		create: {
			email: 'mconnolly@gmail.com',
			firstName: 'Marcus',
			lastName: 'Connolly',
			roles: {
				create: [
					{
						roleName: 'admin'
					},
					{ roleName: 'coach' }
				]
			},
			Coach: {
				create: {
					hourlyRateInCents: 6_000
				}
			}
		}
	});
	const laurence = await prisma.user.upsert({
		where: { email: 'laurencelessard@gmail.com' },
		update: { Coach: { update: { hourlyRateInCents: 3_800 } } },
		create: {
			email: 'laurencelessard@gmail.com',
			firstName: 'Laurence',
			lastName: 'Lessard',
			roles: {
				create: [
					{
						roleName: 'admin'
					},
					{ roleName: 'coach' }
				]
			},
			Coach: {
				create: {
					hourlyRateInCents: 3_800
				}
			}
		}
	});
	const numbers = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
	const skaters: {
		id: string;
		firstName: string;
		lastName: string;
		email: string;
		dateOfBirth: Date | null;
		createdOn: Date;
		modifiedOn: Date | null;
	}[] = [];
	for (const num of numbers) {
		const skater = await prisma.skater.upsert({
			where: { firstName_lastName: { firstName: 'Skater', lastName: num } },
			update: {},
			create: {
				firstName: 'Skater',
				lastName: num,
				email: `skater_${num.toLowerCase()}@gmail.com`
			}
		});
		skaters.push(skater);
	}

	console.log('  Seeding Users -- Complete');

	console.log({ marcus, laurence, adminRole, clientRole, coachRole, skaters });
	await seedAccounting();
	console.log('Seeding complete');
}

await main();
