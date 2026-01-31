/**
 * Database Connectivity Verification Script
 * Verifies Prisma setup, database connection, and schema validity
 * Usage: pnpm exec tsx verify-database.ts
 */

import { db } from "@/lib/db";
import { createLogger } from "@/lib/logger";

const logger = createLogger({ prefix: 'DB-VERIFY' });

async function verifyDatabaseConnectivity() {
  logger.line();
  logger.info('📊 Database Connectivity Verification');
  logger.separator();

  try {
    // Step 1: Check connection
    logger.info('Step 1: Checking database connection...');
    const users = await db.user.count();
    logger.success('Database connection successful');
    logger.info(`Found ${users} user(s)`);
    logger.line();

    // Step 2: Verify schema
    logger.info('Step 2: Verifying schema models...');
    const posts = await db.post.count();
    const comments = await db.comment.count();
    logger.success(`User model: working (${users} records)`);
    logger.success(`Post model: working (${posts} records)`);
    logger.success(`Comment model: working (${comments} records)`);
    logger.line();

    // Step 3: Test query with relations
    logger.info('Step 3: Testing query with relations...');
    const userWithRelations = await db.user.findFirst({
      include: {
        posts: true,
        comments: true,
      },
    });

    if (userWithRelations) {
      logger.success('Relations working correctly');
      logger.success(`Sample user: ${userWithRelations.name}`);
      logger.info(`  - Posts: ${userWithRelations.posts.length}`);
      logger.info(`  - Comments: ${userWithRelations.comments.length}`);
    } else {
      logger.success('No users found (database is empty)');
    }
    logger.line();

    // Step 4: Check database file (SQLite)
    logger.info('Step 4: Database file information...');
    const databaseUrl = process.env.DATABASE_URL;
    logger.success(`DATABASE_URL: ${databaseUrl}`);
    logger.success('Database provider: SQLite');
    logger.line();

    // Step 5: Summary
    logger.separator();
    logger.success('DATABASE CONNECTIVITY VERIFIED SUCCESSFULLY!');
    logger.line();
    logger.info('Next steps:');
    logger.info('1. View database UI: pnpm exec prisma studio');
    logger.info('2. Open browser: http://localhost:5555');
    logger.info('3. Browse tables and records');
    logger.line();
  } catch (error) {
    logger.line();
    logger.error('Database Connectivity Error', error);
    logger.line();
    logger.warn('Troubleshooting:');
    logger.warn('1. Check .env.local exists and DATABASE_URL is set');
    logger.warn('2. Run migrations: pnpm exec prisma migrate dev');
    logger.warn('3. Check database file permissions');
    logger.line();
    process.exit(1);
  }
}

// Run verification
verifyDatabaseConnectivity().finally(() => {
  process.exit(0);
});

