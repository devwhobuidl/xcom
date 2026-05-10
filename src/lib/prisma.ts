import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Diagnostic logging for database connection (Production safe)
const dbUrl = process.env.DATABASE_URL || '';
const sanitizedUrl = dbUrl ? `${dbUrl.split('@')[0].split(':')[0]}://***@***${dbUrl.split('@')[1] || ''}` : 'MISSING';

console.log(`[PRISMA] Initializing connection. URL: ${sanitizedUrl.split('?')[0]}`);

if (!dbUrl) {
  console.error('[PRISMA] CRITICAL ERROR: DATABASE_URL is not defined in environment variables.');
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL || process.env.POSTGRES_URL
    }
  }
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
