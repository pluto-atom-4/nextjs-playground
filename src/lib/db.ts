import "dotenv/config";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaAdapter: PrismaLibSql | undefined;
};

// Global type augmentation for Prisma
declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not set.");
  }

  const adapter =
    globalForPrisma.prismaAdapter ??
    new PrismaLibSql({
      url: databaseUrl,
    });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

globalThis.prisma ??= prismaClientSingleton();

export const db = globalThis.prisma;

export default db;
