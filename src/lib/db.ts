import "dotenv/config";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaLibSql} from "@prisma/adapter-libsql";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set.');
}

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
    prismaAdapter: PrismaLibSql | undefined;
}

const adapter =
    globalForPrisma.prismaAdapter ??
  new PrismaLibSql({
    url: databaseUrl
  });

// Global type augmentation for Prisma
declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
  });
};

export const db = (globalThis.prisma ??= prismaClientSingleton());

export default db;

