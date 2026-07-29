import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL;
  
  if (!connectionString) {
    console.error("❌ DATABASE_URL is missing! Ensure it is set in your environment variables.");
    console.warn("⚠️ Using safe mock for build-time stability.");
    // Return a mock that prevents the build from failing if it tries to query the DB
    return new Proxy({} as any, {
      get: (target, model) => {
        if (model === '$on' || model === '$connect' || model === '$disconnect') return () => {};
        return new Proxy({} as any, {
          get: (target, method) => {
            return async () => {
              console.warn(`Prisma.${String(model)}.${String(method)} called but DATABASE_URL is missing. Returning null.`);
              return null;
            };
          }
        });
      }
    }) as unknown as PrismaClient;
  }

  console.log("📡 Initializing Prisma Client (Prisma 7 Mode)...");
  
  const isPgbouncer = connectionString.includes('pgbouncer=true');

  if (isPgbouncer) {
    console.log("⚡ Mode: Transaction Pooling (pgbouncer enabled)");
  } else {
    console.log("🐘 Mode: Standard Postgres");
  }

  const pool = new pg.Pool({ 
    connectionString,
    ssl: { rejectUnauthorized: false },
    // Optimized pooling for serverless
    max: isPgbouncer ? 1 : 1, 
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
  });
  
  const adapter = new PrismaPg(pool);
  
  return new PrismaClient({ 
    log: ['query', 'error', 'warn'],
    adapter
  });
};

// Lazy-initialized proxy to prevent build-time instantiation errors
export const prisma = new Proxy({} as PrismaClient, {
  get: (target, prop) => {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = createPrismaClient();
    }
    return (globalForPrisma.prisma as any)[prop];
  }
});
