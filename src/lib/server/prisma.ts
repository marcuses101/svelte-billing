// this is a hack pending https://github.com/prisma/prisma/issues/15614

/*

import { PrismaClient as ImportedPrismaClient } from '@prisma/client';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const { PrismaClient: RequiredPrismaClient } = require('@prisma/client');
const _PrismaClient: typeof ImportedPrismaClient = RequiredPrismaClient;

export class PrismaClient extends _PrismaClient {}
*/
