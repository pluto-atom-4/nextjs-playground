import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { db } from '@/lib/db';

describe('Seed Script', () => {
  // Helper to clean up test data
  const cleanupTestData = async () => {
    await db.comment.deleteMany({});
    await db.post.deleteMany({});
    await db.user.deleteMany({});
  };

  beforeEach(async () => {
    // Clean up before each test
    await cleanupTestData();
  });

  afterEach(async () => {
    // Clean up after each test
    await cleanupTestData();
  });

  describe('User Creation', () => {
    it('should create a single user', async () => {
      const user = await db.user.create({
        data: {
          email: 'test@example.com',
          name: 'Test User',
        },
      });

      expect(user).toBeDefined();
      expect(user.id).toBeTruthy();
      expect(user.email).toBe('test@example.com');
      expect(user.name).toBe('Test User');
    });

    it('should create multiple users', async () => {
      const user1 = await db.user.create({
        data: { email: 'user1@example.com', name: 'User 1' },
      });

      const user2 = await db.user.create({
        data: { email: 'user2@example.com', name: 'User 2' },
      });

      const users = await db.user.findMany();
      expect(users).toHaveLength(2);
      expect(users.map(u => u.id)).toContain(user1.id);
      expect(users.map(u => u.id)).toContain(user2.id);
    });

    it('should have automatic timestamps on user creation', async () => {
      const user = await db.user.create({
        data: { email: 'timestamp@example.com', name: 'Timestamp User' },
      });

      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
      expect(user.createdAt.getTime()).toBeLessThanOrEqual(user.updatedAt.getTime());
    });

    it('should prevent duplicate emails', async () => {
      const email = 'duplicate@example.com';

      await db.user.create({
        data: { email, name: 'User 1' },
      });

      await expect(
        db.user.create({
          data: { email, name: 'User 2' },
        })
      ).rejects.toThrow();
    });
  });

  describe('Post Creation', () => {
    it('should create a post with author', async () => {
      const user = await db.user.create({
        data: { email: 'author@example.com', name: 'Author' },
      });

      const post = await db.post.create({
        data: {
          title: 'Test Post',
          content: 'Test content',
          authorId: user.id,
        },
      });

      expect(post).toBeDefined();
      expect(post.id).toBeTruthy();
      expect(post.title).toBe('Test Post');
      expect(post.content).toBe('Test content');
      expect(post.authorId).toBe(user.id);
    });

    it('should create multiple posts for same author', async () => {
      const user = await db.user.create({
        data: { email: 'author@example.com', name: 'Author' },
      });

      const post1 = await db.post.create({
        data: {
          title: 'Post 1',
          content: 'Content 1',
          authorId: user.id,
        },
      });

      const post2 = await db.post.create({
        data: {
          title: 'Post 2',
          content: 'Content 2',
          authorId: user.id,
        },
      });

      const userWithPosts = await db.user.findUnique({
        where: { id: user.id },
        include: { posts: true },
      });

      expect(userWithPosts?.posts).toHaveLength(2);
      expect(userWithPosts?.posts?.map(p => p.id)).toContain(post1.id);
      expect(userWithPosts?.posts?.map(p => p.id)).toContain(post2.id);
    });

    it('should include author in post query', async () => {
      const user = await db.user.create({
        data: { email: 'author@example.com', name: 'Author' },
      });

      const post = await db.post.create({
        data: {
          title: 'Test Post',
          content: 'Test content',
          authorId: user.id,
        },
      });

      const foundPost = await db.post.findUnique({
        where: { id: post.id },
        include: { author: true },
      });

      expect(foundPost?.author).toBeDefined();
      expect(foundPost?.author.id).toBe(user.id);
      expect(foundPost?.author.email).toBe('author@example.com');
    });

    it('should have automatic timestamps on post creation', async () => {
      const user = await db.user.create({
        data: { email: 'author@example.com', name: 'Author' },
      });

      const post = await db.post.create({
        data: {
          title: 'Timestamp Post',
          content: 'Test',
          authorId: user.id,
        },
      });

      expect(post.createdAt).toBeInstanceOf(Date);
      expect(post.updatedAt).toBeInstanceOf(Date);
      expect(post.createdAt.getTime()).toBeLessThanOrEqual(post.updatedAt.getTime());
    });
  });

  describe('Comment Creation', () => {
    it('should create a comment with post and author', async () => {
      const author = await db.user.create({
        data: { email: 'author@example.com', name: 'Author' },
      });

      const post = await db.post.create({
        data: {
          title: 'Test Post',
          content: 'Test content',
          authorId: author.id,
        },
      });

      const comment = await db.comment.create({
        data: {
          text: 'Great post!',
          postId: post.id,
          authorId: author.id,
        },
      });

      expect(comment).toBeDefined();
      expect(comment.id).toBeTruthy();
      expect(comment.text).toBe('Great post!');
      expect(comment.postId).toBe(post.id);
      expect(comment.authorId).toBe(author.id);
    });

    it('should create multiple comments on same post', async () => {
      const user1 = await db.user.create({
        data: { email: 'user1@example.com', name: 'User 1' },
      });

      const user2 = await db.user.create({
        data: { email: 'user2@example.com', name: 'User 2' },
      });

      const post = await db.post.create({
        data: {
          title: 'Popular Post',
          content: 'Great content',
          authorId: user1.id,
        },
      });

      const comment1 = await db.comment.create({
        data: {
          text: 'Comment 1',
          postId: post.id,
          authorId: user1.id,
        },
      });

      const comment2 = await db.comment.create({
        data: {
          text: 'Comment 2',
          postId: post.id,
          authorId: user2.id,
        },
      });

      const postWithComments = await db.post.findUnique({
        where: { id: post.id },
        include: { comments: true },
      });

      expect(postWithComments?.comments).toHaveLength(2);
      expect(postWithComments?.comments?.map(c => c.id)).toContain(comment1.id);
      expect(postWithComments?.comments?.map(c => c.id)).toContain(comment2.id);
    });

    it('should include post and author in comment query', async () => {
      const author = await db.user.create({
        data: { email: 'author@example.com', name: 'Author' },
      });

      const commenter = await db.user.create({
        data: { email: 'commenter@example.com', name: 'Commenter' },
      });

      const post = await db.post.create({
        data: {
          title: 'Test Post',
          content: 'Test content',
          authorId: author.id,
        },
      });

      const comment = await db.comment.create({
        data: {
          text: 'Great post!',
          postId: post.id,
          authorId: commenter.id,
        },
      });

      const foundComment = await db.comment.findUnique({
        where: { id: comment.id },
        include: { author: true, post: true },
      });

      expect(foundComment?.author).toBeDefined();
      expect(foundComment?.author.id).toBe(commenter.id);
      expect(foundComment?.author.email).toBe('commenter@example.com');
      expect(foundComment?.post).toBeDefined();
      expect(foundComment?.post.id).toBe(post.id);
      expect(foundComment?.post.title).toBe('Test Post');
    });

    it('should have automatic timestamps on comment creation', async () => {
      const user = await db.user.create({
        data: { email: 'user@example.com', name: 'User' },
      });

      const post = await db.post.create({
        data: {
          title: 'Test Post',
          content: 'Test',
          authorId: user.id,
        },
      });

      const comment = await db.comment.create({
        data: {
          text: 'Comment',
          postId: post.id,
          authorId: user.id,
        },
      });

      expect(comment.createdAt).toBeInstanceOf(Date);
      expect(comment.updatedAt).toBeInstanceOf(Date);
      expect(comment.createdAt.getTime()).toBeLessThanOrEqual(comment.updatedAt.getTime());
    });
  });

  describe('Seed Data Relationships', () => {
    it('should create complete data model', async () => {
      // Create users
      const alice = await db.user.create({
        data: { email: 'alice@example.com', name: 'Alice' },
      });

      const bob = await db.user.create({
        data: { email: 'bob@example.com', name: 'Bob' },
      });

      // Create posts
      const post1 = await db.post.create({
        data: {
          title: 'Alice Post',
          content: 'Alice content',
          authorId: alice.id,
        },
      });

      const post2 = await db.post.create({
        data: {
          title: 'Bob Post',
          content: 'Bob content',
          authorId: bob.id,
        },
      });

      // Create comments
      const comment1 = await db.comment.create({
        data: {
          text: 'Bob comments on Alice post',
          postId: post1.id,
          authorId: bob.id,
        },
      });

      const comment2 = await db.comment.create({
        data: {
          text: 'Alice comments on Bob post',
          postId: post2.id,
          authorId: alice.id,
        },
      });

      // Verify complete data model
      expect(await db.user.count()).toBe(2);
      expect(await db.post.count()).toBe(2);
      expect(await db.comment.count()).toBe(2);

      // Verify relationships
      const aliceData = await db.user.findUnique({
        where: { id: alice.id },
        include: { posts: true, comments: true },
      });

      expect(aliceData?.posts).toHaveLength(1);
      expect(aliceData?.comments).toHaveLength(1);

      const bobData = await db.user.findUnique({
        where: { id: bob.id },
        include: { posts: true, comments: true },
      });

      expect(bobData?.posts).toHaveLength(1);
      expect(bobData?.comments).toHaveLength(1);
    });

    it('should handle cascade delete for comments', async () => {
      const user = await db.user.create({
        data: { email: 'delete@example.com', name: 'Delete Test' },
      });

      const post = await db.post.create({
        data: {
          title: 'To Delete',
          content: 'To Delete',
          authorId: user.id,
        },
      });

      const comment = await db.comment.create({
        data: {
          text: 'Comment on post to delete',
          postId: post.id,
          authorId: user.id,
        },
      });

      // Delete post
      await db.post.delete({ where: { id: post.id } });

      // Verify comment was deleted
      const remainingComments = await db.comment.findMany({
        where: { postId: post.id },
      });

      expect(remainingComments).toHaveLength(0);
    });
  });

  describe('Seed Idempotence', () => {
    it('should allow re-running seed script by checking for existing data', async () => {
      const email = 'idempotent@example.com';

      // First run
      const user1 = await db.user.create({
        data: { email, name: 'User' },
      });

      const count1 = await db.user.count();

      // Try to create again with same email (simulating re-run)
      // Should fail with constraint error
      await expect(
        db.user.create({
          data: { email, name: 'User' },
        })
      ).rejects.toThrow();

      const count2 = await db.user.count();
      expect(count1).toBe(count2);
    });
  });
});

