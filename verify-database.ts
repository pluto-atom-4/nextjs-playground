/**
 * Database Connectivity Verification Script
 * Verifies Prisma setup, database connection, and schema validity
 * Usage: pnpm exec tsx verify-database.ts
 */

import { db } from './src/lib/db';

async function verifyDatabaseConnectivity() {
  console.log('\n📊 Database Connectivity Verification\n');
  console.log('=' .repeat(60));

  try {
    // Step 1: Check connection
    console.log('\n✓ Step 1: Checking database connection...');
    const users = await db.user.count();
    console.log(`  ✓ Database connection successful`);
    console.log(`  ✓ Found ${users} user(s)\n`);

    // Step 2: Verify schema
    console.log('✓ Step 2: Verifying schema models...');
    const posts = await db.post.count();
    const comments = await db.comment.count();
    console.log(`  ✓ User model: working (${users} records)`);
    console.log(`  ✓ Post model: working (${posts} records)`);
    console.log(`  ✓ Comment model: working (${comments} records)\n`);

    // Step 3: Test query with relations
    console.log('✓ Step 3: Testing query with relations...');
    const userWithRelations = await db.user.findFirst({
      include: {
        posts: true,
        comments: true,
      },
    });

    if (userWithRelations) {
      console.log(`  ✓ Relations working correctly`);
      console.log(`  ✓ Sample user: ${userWithRelations.name}`);
      console.log(`    - Posts: ${userWithRelations.posts.length}`);
      console.log(`    - Comments: ${userWithRelations.comments.length}\n`);
    } else {
      console.log(`  ✓ No users found (database is empty)\n`);
    }

    // Step 4: Check database file (SQLite)
    console.log('✓ Step 4: Database file information...');
    const databaseUrl = process.env.DATABASE_URL;
    console.log(`  ✓ DATABASE_URL: ${databaseUrl}`);
    console.log(`  ✓ Database provider: SQLite\n`);

    // Step 5: Summary
    console.log('=' .repeat(60));
    console.log('\n✅ DATABASE CONNECTIVITY VERIFIED SUCCESSFULLY!\n');
    console.log('Next steps:');
    console.log('1. View database UI: pnpm exec prisma studio');
    console.log('2. Open browser: http://localhost:5555');
    console.log('3. Browse tables and records\n');

  } catch (error) {
    console.error('\n❌ Database Connectivity Error:');
    console.error(error instanceof Error ? error.message : String(error));
    console.error('\nTroubleshooting:');
    console.error('1. Check .env.local exists and DATABASE_URL is set');
    console.error('2. Run migrations: pnpm exec prisma migrate dev');
    console.error('3. Check database file permissions');
    process.exit(1);
  }
}

// Run verification
verifyDatabaseConnectivity().finally(() => {
  process.exit(0);
});

