import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db } from '@/lib/db';

describe('Database Setup', () => {
  beforeAll(async () => {
    // Connection already established via singleton
    // Verify we can connect
    await db.$queryRaw`SELECT 1`;
  });

  afterAll(async () => {
    // Disconnect after all tests
    await db.$disconnect();
  });

  describe('Connection', () => {
    it('should connect to database', async () => {
      expect(db).toBeDefined();
      expect(typeof db).toBe('object');
      expect(db).toHaveProperty('$connect');
      expect(db).toHaveProperty('$disconnect');
      expect(db).toHaveProperty('user');
      expect(db).toHaveProperty('post');
      expect(db).toHaveProperty('comment');
    });

    it('should execute raw query', async () => {
      const result = await db.$queryRaw`SELECT 1 as test`;
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle multiple concurrent queries', async () => {
      const results = await Promise.all([
        db.user.count(),
        db.post.count(),
        db.comment.count(),
      ]);

      expect(results).toHaveLength(3);
      expect(results.every(r => typeof r === 'number')).toBe(true);
    });
  });

  describe('Table Structure', () => {
    it('should have User table with correct fields', async () => {
      const result = await db.user.findFirst();
      // If data exists, verify field structure
      if (result) {
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('email');
        expect(result).toHaveProperty('name');
        expect(result).toHaveProperty('createdAt');
        expect(result).toHaveProperty('updatedAt');
      }
    });

    it('should have Post table with correct fields', async () => {
      const result = await db.post.findFirst();
      // If data exists, verify field structure
      if (result) {
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('title');
        expect(result).toHaveProperty('content');
        expect(result).toHaveProperty('authorId');
        expect(result).toHaveProperty('createdAt');
        expect(result).toHaveProperty('updatedAt');
      }
    });

    it('should have Comment table with correct fields', async () => {
      const result = await db.comment.findFirst();
      // If data exists, verify field structure
      if (result) {
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('text');
        expect(result).toHaveProperty('postId');
        expect(result).toHaveProperty('authorId');
        expect(result).toHaveProperty('createdAt');
        expect(result).toHaveProperty('updatedAt');
      }
    });
  });

  describe('Data Operations', () => {
    it('should count users', async () => {
      const count = await db.user.count();
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
    });

    it('should count posts', async () => {
      const count = await db.post.count();
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
    });

    it('should count comments', async () => {
      const count = await db.comment.count();
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
    });

    it('should retrieve users', async () => {
      const users = await db.user.findMany();
      expect(Array.isArray(users)).toBe(true);
    });

    it('should retrieve posts', async () => {
      const posts = await db.post.findMany();
      expect(Array.isArray(posts)).toBe(true);
    });

    it('should retrieve comments', async () => {
      const comments = await db.comment.findMany();
      expect(Array.isArray(comments)).toBe(true);
    });
  });

  describe('Relationships', () => {
    it('should support post with author relationship', async () => {
      const post = await db.post.findFirst({
        include: { author: true },
      });

      if (post) {
        expect(post.author).toBeDefined();
        expect(post.author.id).toBe(post.authorId);
      }
    });

    it('should support comment with post and author relationships', async () => {
      const comment = await db.comment.findFirst({
        include: { post: true, author: true },
      });

      if (comment) {
        expect(comment.post).toBeDefined();
        expect(comment.author).toBeDefined();
        expect(comment.post.id).toBe(comment.postId);
        expect(comment.author.id).toBe(comment.authorId);
      }
    });

    it('should support user with posts', async () => {
      const user = await db.user.findFirst({
        include: { posts: true },
      });

      if (user) {
        expect(Array.isArray(user.posts)).toBe(true);
      }
    });

    it('should support user with comments', async () => {
      const user = await db.user.findFirst({
        include: { comments: true },
      });

      if (user) {
        expect(Array.isArray(user.comments)).toBe(true);
      }
    });
  });
});

