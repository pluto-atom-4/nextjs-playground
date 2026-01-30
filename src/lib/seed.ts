// src/lib/seed.ts
// Prisma 7 Database Seeding Script
// Run with: pnpm seed

import { db } from './db';
import { createLogger } from './logger';

const logger = createLogger({ prefix: 'SEED' });

async function main() {
  logger.info('🌱 Starting database seed...');

  try {
    // Verify database connection
    await db.$queryRaw`SELECT 1`;
    logger.success('Database connection verified');

    // Clear existing data (optional, for development only)
    // await db.comment.deleteMany({});
    // await db.post.deleteMany({});
    // await db.user.deleteMany({});

    // Create users
    const user1 = await db.user.create({
      data: {
        email: 'alice@example.com',
        name: 'Alice Johnson',
      },
    });

    const user2 = await db.user.create({
      data: {
        email: 'bob@example.com',
        name: 'Bob Smith',
      },
    });

    logger.success(`Users created: ${[user1.id, user2.id].join(', ')}`);

    // Create posts
    const post1 = await db.post.create({
      data: {
        title: 'Getting Started with Next.js',
        content:
          'Next.js is a powerful framework for building React applications...',
        authorId: user1.id,
      },
    });

    const post2 = await db.post.create({
      data: {
        title: 'Understanding Server Components',
        content:
          'Server Components allow you to write async components directly in React...',
        authorId: user1.id,
      },
    });

    const post3 = await db.post.create({
      data: {
        title: 'React Query Best Practices',
        content:
          'React Query is a powerful library for managing server state in your application...',
        authorId: user2.id,
      },
    });

    logger.success(`Posts created: ${[post1.id, post2.id, post3.id].join(', ')}`);

    // Create comments
    const comment1 = await db.comment.create({
      data: {
        text: 'Great post! Really helpful for beginners.',
        postId: post1.id,
        authorId: user2.id,
      },
    });

    const comment2 = await db.comment.create({
      data: {
        text: 'Server Components are game-changing!',
        postId: post2.id,
        authorId: user2.id,
      },
    });

    const comment3 = await db.comment.create({
      data: {
        text: 'This saved me so much time!',
        postId: post3.id,
        authorId: user1.id,
      },
    });

    logger.success(`Comments created: ${[comment1.id, comment2.id, comment3.id].join(', ')}`);

    logger.success('Database seeded successfully!');
  } catch (error) {
    logger.error('Seed error', error);
    throw error;
  }
}

main()
  .catch((e) => {
    logger.error('Seed failed', e);
    process.exit(1);
  })
  .finally(async () => {
    // Prisma 7: Improved client cleanup
    await db.$disconnect();
  });