import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// Supabase/Vercel integration often provides DATABASE_URL or POSTGRES_URL
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

let prisma: PrismaClient;

if (!connectionString) {
  console.warn("⚠️ DATABASE_URL is not set. The rebellion is running in offline mode.");
  // Still initialize to avoid import errors, but operations will fail gracefully via try/catch in actions
  prisma = globalForPrisma.prisma || new PrismaClient();
} else {
  try {
    const pool = new Pool({ 
      connectionString,
      max: 10, // Limit max connections for serverless
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
    });

    const adapter = new PrismaPg(pool);

    prisma = globalForPrisma.prisma || new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });

    // Test connection lazily
    prisma.$connect().catch(err => {
      console.error("❌ Prisma connection failed at runtime:", err.message);
    });

  } catch (error: any) {
    console.error("❌ Failed to initialize Prisma adapter:", error.message);
    // Fallback to standard client (might still fail, but better than a hard crash here)
    prisma = globalForPrisma.prisma || new PrismaClient();
  }
}

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export { prisma };
export default prisma;
