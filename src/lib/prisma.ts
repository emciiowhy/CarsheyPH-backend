// backend/src/lib/prisma.ts

import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Client } from '@neondatabase/serverless';

// Prevent multiple instances in dev (hot reload)
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Create Neon HTTP client
const client = new Client({
  connectionString: process.env.DATABASE_URL!,
});

// Connect once (required for PrismaNeon)
client.connect();

// Create Prisma adapter using the Neon client
const adapter = new PrismaNeon(client);

// Create Prisma client
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
