import { randomUUID } from 'node:crypto';
import knex from 'knex';
const db = knex({
	client: 'better-sqlite3', // or 'better-sqlite3'
	connection: {
		filename: './mydb.sqlite'
	}
});

export type Skater = {
	id: string;
	firstName: string;
	lastName: string;
};

export type Lesson = {
	id: string;
	coachId: string;
	skaterIds: string[];
	lessonTimeInMinutes: number;
	lessonDate: Date;
	createdDate: Date;
	modifiedDate: Date | null;
};

const skaterMap: Map<string, Skater> = new Map([
	['1', { id: '1', firstName: 'James', lastName: 'Connolly' }],
	['2', { id: '2', firstName: 'Marcus', lastName: 'Connolly' }],
	['3', { id: '3', firstName: 'Laurence', lastName: 'Lessard' }]
]);

const lessons = [];

export function addLesson(
	coachId: string,
	skaterIds: string[],
	lessonTimeInMinutes: number,
	lessonDate: Date
) {
	const newLesson: Lesson = {
		id: randomUUID(),
		coachId,
		skaterIds,
		lessonTimeInMinutes,
		lessonDate,
		createdDate: new Date(),
		modifiedDate: null
	};
	lessons.push(newLesson);
	return newLesson;
}

export function getSkaters() {
	return [...skaterMap.values()];
}

export function getSkaterById(id: string) {
	return skaterMap.get(id);
}

export function addSkater(firstName: string, lastName: string) {
	const id = randomUUID();
	const newSkater = { id, firstName, lastName };
	skaterMap.set(id, newSkater);
	return newSkater;
}
