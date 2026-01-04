import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db } from '@/lib/db';

describe('Schema Validation', () => {
  let testUserId: string;
  let testPostId: string;
  let testCommentId: string;

  beforeAll(async () => {
    // Create test data for schema validation
    const user = await db.user.create({
      data: {
        email: `schema-test-${Date.now()}@example.com`,
        name: 'Schema Test User',
      },
    });
    testUserId = user.id;

    const post = await db.post.create({
      data: {
        title: 'Schema Test Post',
        content: 'This is a test post for schema validation',
        authorId: testUserId,
      },
    });
    testPostId = post.id;

    const comment = await db.comment.create({
      data: {
        text: 'Schema test comment',
        postId: testPostId,
        authorId: testUserId,
      },
    });
    testCommentId = comment.id;
  });

  afterAll(async () => {
    // Clean up test data
    if (testCommentId) {
      await db.comment.deleteMany({ where: { id: testCommentId } });
    }
    if (testPostId) {
      await db.post.deleteMany({ where: { id: testPostId } });
    }
    if (testUserId) {
      await db.user.deleteMany({ where: { id: testUserId } });
    }
  });

  describe('User Model Validation', () => {
    it('should have correct User model fields', async () => {
      const user = await db.user.findUnique({ where: { id: testUserId } });

      expect(user).toBeDefined();
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('createdAt');
      expect(user).toHaveProperty('updatedAt');
    });

    it('should have valid User field types', async () => {
      const user = await db.user.findUnique({ where: { id: testUserId } });

      expect(typeof user?.id).toBe('string');
      expect(typeof user?.email).toBe('string');
      expect(typeof user?.name).toBe('string');
      expect(user?.createdAt).toBeInstanceOf(Date);
      expect(user?.updatedAt).toBeInstanceOf(Date);
    });

    it('should enforce unique email constraint', async () => {
      const testEmail = `unique-test-${Date.now()}@example.com`;

      // Create user with unique email
      const user1 = await db.user.create({
        data: { email: testEmail, name: 'User 1' },
      });

      // Attempt to create user with same email should fail
      await expect(
        db.user.create({
          data: { email: testEmail, name: 'User 2' },
        })
      ).rejects.toThrow();

      // Clean up
      await db.user.delete({ where: { id: user1.id } });
    });

    it('should have automatic timestamps', async () => {
      const user = await db.user.findUnique({ where: { id: testUserId } });

      expect(user?.createdAt).toBeDefined();
      expect(user?.updatedAt).toBeDefined();
      expect(user?.createdAt?.getTime()).toBeLessThanOrEqual(user?.updatedAt?.getTime() || 0);
    });

    it('should have valid email format when created', async () => {
      const user = await db.user.findUnique({ where: { id: testUserId } });

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(user?.email).toMatch(emailRegex);
    });

    it('should have non-empty name', async () => {
      const user = await db.user.findUnique({ where: { id: testUserId } });

      expect(user?.name).toBeTruthy();
      expect(user?.name?.length).toBeGreaterThan(0);
    });
  });

  describe('Post Model Validation', () => {
    it('should have correct Post model fields', async () => {
      const post = await db.post.findUnique({ where: { id: testPostId } });

      expect(post).toBeDefined();
      expect(post).toHaveProperty('id');
      expect(post).toHaveProperty('title');
      expect(post).toHaveProperty('content');
      expect(post).toHaveProperty('authorId');
      expect(post).toHaveProperty('createdAt');
      expect(post).toHaveProperty('updatedAt');
    });

    it('should have valid Post field types', async () => {
      const post = await db.post.findUnique({ where: { id: testPostId } });

      expect(typeof post?.id).toBe('string');
      expect(typeof post?.title).toBe('string');
      expect(typeof post?.content).toBe('string');
      expect(typeof post?.authorId).toBe('string');
      expect(post?.createdAt).toBeInstanceOf(Date);
      expect(post?.updatedAt).toBeInstanceOf(Date);
    });

    it('should have valid author relationship', async () => {
      const post = await db.post.findUnique({
        where: { id: testPostId },
        include: { author: true },
      });

      expect(post?.authorId).toBe(testUserId);
      expect(post?.author?.id).toBe(testUserId);
    });

    it('should have non-empty title and content', async () => {
      const post = await db.post.findUnique({ where: { id: testPostId } });

      expect(post?.title).toBeTruthy();
      expect(post?.title?.length).toBeGreaterThan(0);
      expect(post?.content).toBeTruthy();
      expect(post?.content?.length).toBeGreaterThan(0);
    });

    it('should have automatic timestamps', async () => {
      const post = await db.post.findUnique({ where: { id: testPostId } });

      expect(post?.createdAt).toBeDefined();
      expect(post?.updatedAt).toBeDefined();
      expect(post?.createdAt?.getTime()).toBeLessThanOrEqual(post?.updatedAt?.getTime() || 0);
    });
  });

  describe('Comment Model Validation', () => {
    it('should have correct Comment model fields', async () => {
      const comment = await db.comment.findUnique({
        where: { id: testCommentId },
      });

      expect(comment).toBeDefined();
      expect(comment).toHaveProperty('id');
      expect(comment).toHaveProperty('text');
      expect(comment).toHaveProperty('postId');
      expect(comment).toHaveProperty('authorId');
      expect(comment).toHaveProperty('createdAt');
      expect(comment).toHaveProperty('updatedAt');
    });

    it('should have valid Comment field types', async () => {
      const comment = await db.comment.findUnique({
        where: { id: testCommentId },
      });

      expect(typeof comment?.id).toBe('string');
      expect(typeof comment?.text).toBe('string');
      expect(typeof comment?.postId).toBe('string');
      expect(typeof comment?.authorId).toBe('string');
      expect(comment?.createdAt).toBeInstanceOf(Date);
      expect(comment?.updatedAt).toBeInstanceOf(Date);
    });

    it('should have valid post relationship', async () => {
      const comment = await db.comment.findUnique({
        where: { id: testCommentId },
        include: { post: true },
      });

      expect(comment?.postId).toBe(testPostId);
      expect(comment?.post?.id).toBe(testPostId);
    });

    it('should have valid author relationship', async () => {
      const comment = await db.comment.findUnique({
        where: { id: testCommentId },
        include: { author: true },
      });

      expect(comment?.authorId).toBe(testUserId);
      expect(comment?.author?.id).toBe(testUserId);
    });

    it('should have non-empty text', async () => {
      const comment = await db.comment.findUnique({
        where: { id: testCommentId },
      });

      expect(comment?.text).toBeTruthy();
      expect(comment?.text?.length).toBeGreaterThan(0);
    });

    it('should have automatic timestamps', async () => {
      const comment = await db.comment.findUnique({
        where: { id: testCommentId },
      });

      expect(comment?.createdAt).toBeDefined();
      expect(comment?.updatedAt).toBeDefined();
      expect(comment?.createdAt?.getTime()).toBeLessThanOrEqual(comment?.updatedAt?.getTime() || 0);
    });
  });

  describe('Relationship Integrity', () => {
    it('should maintain referential integrity between Post and User', async () => {
      const post = await db.post.findUnique({
        where: { id: testPostId },
        include: { author: true },
      });

      expect(post?.author.email).toBeDefined();
      expect(post?.author.name).toBeDefined();
      expect(post?.author.id).toBe(testUserId);
    });

    it('should maintain referential integrity between Comment and Post', async () => {
      const comment = await db.comment.findUnique({
        where: { id: testCommentId },
        include: { post: true },
      });

      expect(comment?.post.title).toBeDefined();
      expect(comment?.post.content).toBeDefined();
      expect(comment?.post.id).toBe(testPostId);
    });

    it('should maintain referential integrity between Comment and User', async () => {
      const comment = await db.comment.findUnique({
        where: { id: testCommentId },
        include: { author: true },
      });

      expect(comment?.author.email).toBeDefined();
      expect(comment?.author.name).toBeDefined();
      expect(comment?.author.id).toBe(testUserId);
    });

    it('should support reverse relationships', async () => {
      const user = await db.user.findUnique({
        where: { id: testUserId },
        include: { posts: true, comments: true },
      });

      expect(Array.isArray(user?.posts)).toBe(true);
      expect(Array.isArray(user?.comments)).toBe(true);
      expect(user?.posts?.some(p => p.id === testPostId)).toBe(true);
      expect(user?.comments?.some(c => c.id === testCommentId)).toBe(true);
    });
  });
});

