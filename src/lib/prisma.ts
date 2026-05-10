import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Diagnostic logging for database connection (Production safe)
const dbUrl = process.env.DATABASE_URL || '';
const directUrl = process.env.DIRECT_URL || '';

const sanitize = (url: string) => {
  if (!url) return 'MISSING';
  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.username}:***@${parsed.host}${parsed.pathname}`;
  } catch {
    return 'INVALID_FORMAT';
  }
};

console.log(`[PRISMA] Initializing connection.`);
console.log(`[PRISMA] Pooled URL: ${sanitize(dbUrl)}`);
console.log(`[PRISMA] Direct URL: ${sanitize(directUrl)}`);

if (!dbUrl) {
  console.error('[PRISMA] CRITICAL ERROR: DATABASE_URL is not defined.');
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
