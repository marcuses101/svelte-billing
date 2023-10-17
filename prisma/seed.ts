import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
	console.log('Seeding beginning');
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

	const marcus = await prisma.user.upsert({
		where: { email: 'mnjconnolly@gmail.com' },
		update: {},
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
					hourlyRateInCents: 60_000
				}
			}
		}
	});
	const laurence = await prisma.user.upsert({
		where: { email: 'laurencelessard@gmail.com' },
		update: {},
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
					hourlyRateInCents: 38_000
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

	console.log({ marcus, laurence, adminRole, clientRole, coachRole, skaters });
	console.log('Seeding complete');
}

await main();
