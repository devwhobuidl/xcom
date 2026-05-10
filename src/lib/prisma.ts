import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// Supabase/Vercel integration often provides DATABASE_URL or POSTGRES_URL
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

let prisma: PrismaClient;

if (!connectionString) {
  console.error("❌ CRITICAL: DATABASE_URL is not set. The rebellion is blind!");
  prisma = globalForPrisma.prisma || new PrismaClient({
    log: ["error"],
  });
} else {
  try {
    // Detailed logging for debugging (masked for safety)
    const urlType = connectionString.startsWith("postgresql://") ? "postgresql" : 
                    connectionString.startsWith("postgres://") ? "postgres" : "INVALID";
    const urlLength = connectionString.length;
    console.log(`📡 Initializing DB connection: type=${urlType}, length=${urlLength}, prefix=${connectionString.substring(0, 10)}...`);

    if (urlType === "INVALID") {
      console.error("❌ INVALID_DATABASE_URL: Must start with postgresql:// or postgres://. Current prefix:", connectionString.substring(0, 15));
    }

    const pool = new Pool({ 
      connectionString,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000, // Increased timeout
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
    });

    pool.on('error', (err) => {
      console.error('❌ Unexpected error on idle database client', err);
    });

    const adapter = new PrismaPg(pool);

    prisma = globalForPrisma.prisma || new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });

    // Test connection lazily
    prisma.$connect()
      .then(() => console.log("✅ Database rebellion connection established."))
      .catch(err => {
        console.error("❌ Prisma connection failed at runtime:", err.message);
      });

  } catch (error: any) {
    console.error("❌ Failed to initialize Prisma adapter:", error.message);
    // Fallback to standard client
    prisma = globalForPrisma.prisma || new PrismaClient();
  }
}

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export { prisma };
export default prisma;
