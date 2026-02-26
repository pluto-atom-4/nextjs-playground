// prisma.config.ts – Prisma 7 configuration file.
// Provides datasource URL for migrations (prisma migrate) and schema introspection.
// The PrismaClient adapter for runtime connections is configured in src/lib/db.ts.
// See https://pris.ly/d/config-datasource
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
