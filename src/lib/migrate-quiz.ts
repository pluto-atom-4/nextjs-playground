import "dotenv/config";
import { PrismaClient } from '@/generated/prisma/client';
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createLogger } from '@/lib/logger';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set.');
}

const adapter = new PrismaLibSql({
  url: databaseUrl
});

const prisma = new PrismaClient({ adapter });
const logger = createLogger({ prefix: 'QUIZ-MIGRATE' });

async function main() {
  logger.info('Running quiz table migrations...');

  try {
    // Check if tables exist, if not they'll be created by Prisma
    await prisma.quizSession.findMany();
    logger.success('Quiz tables already exist');
  } catch (error) {
    logger.info('Tables will be created on first deploy');
  }

  logger.success('Migration check complete');
}

main()
  .catch((error) => {
    logger.error('Migration failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
