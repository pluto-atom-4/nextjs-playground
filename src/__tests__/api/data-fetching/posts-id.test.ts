import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, PUT, DELETE } from '@/app/api/data-fetching/posts/[id]/route';
import { db } from '@/lib/db';

describe('POST /api/data-fetching/posts/[id]', () => {
  let testUserId: string;
  let testPostId: string;

  beforeAll(async () => {
    await db.$connect();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  beforeEach(async () => {
    const user = await db.user.create({
      data: {
        email: `test-${Date.now()}-${Math.random()}-id@example.com`,
        name: 'Test User for [id]',
      },
    });
    testUserId = user.id;

    const post = await db.post.create({
      data: {
        title: 'Test Post for [id] Route',
        content: 'Initial test content',
        authorId: testUserId,
      },
    });
    testPostId = post.id;
  });

  afterEach(async () => {
    await db.post.deleteMany({
      where: { authorId: testUserId },
    });
    await db.user.delete({
      where: { id: testUserId },
    });
  });

  describe('GET Endpoint - Fetch Single Post', () => {
    it('should fetch a single post by ID', async () => {
      const request = new NextRequest(
        `http://localhost:3000/api/data-fetching/posts/${testPostId}`,
        { method: 'GET' }
      );

      const response = await GET(request, { params: { id: testPostId } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('id', testPostId);
      expect(data).toHaveProperty('title', 'Test Post for [id] Route');
    });

    it('should return 404 when post ID does not exist', async () => {
      const nonExistentId = 'non-existent-id-12345';

      const request = new NextRequest(
        `http://localhost:3000/api/data-fetching/posts/${nonExistentId}`,
        { method: 'GET' }
      );

      const response = await GET(request, { params: { id: nonExistentId } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty('error', 'Post not found');
    });
  });

  describe('PUT Endpoint - Update Post', () => {
    it('should update post title', async () => {
      const request = new NextRequest(
        `http://localhost:3000/api/data-fetching/posts/${testPostId}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            title: 'Updated Title',
          }),
        }
      );

      const response = await PUT(request, { params: { id: testPostId } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('id', testPostId);
      expect(data).toHaveProperty('title', 'Updated Title');
    });

    it('should return 404 when updating non-existent post', async () => {
      const nonExistentId = 'non-existent-id-12345';

      const request = new NextRequest(
        `http://localhost:3000/api/data-fetching/posts/${nonExistentId}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            title: 'Updated Title',
          }),
        }
      );

      const response = await PUT(request, { params: { id: nonExistentId } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty('error', 'Post not found');
    });

    it('should return 400 when no update fields provided', async () => {
      const request = new NextRequest(
        `http://localhost:3000/api/data-fetching/posts/${testPostId}`,
        {
          method: 'PUT',
          body: JSON.stringify({}),
        }
      );

      const response = await PUT(request, { params: { id: testPostId } });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
    });
  });

  describe('DELETE Endpoint - Remove Post', () => {
    it('should delete an existing post', async () => {
      const request = new NextRequest(
        `http://localhost:3000/api/data-fetching/posts/${testPostId}`,
        { method: 'DELETE' }
      );

      const response = await DELETE(request, { params: { id: testPostId } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('message', 'Post deleted');
      expect(data).toHaveProperty('id', testPostId);

      const deletedPost = await db.post.findUnique({
        where: { id: testPostId },
      });
      expect(deletedPost).toBeNull();
    });

    it('should return 404 when deleting non-existent post', async () => {
      const nonExistentId = 'non-existent-id-12345';

      const request = new NextRequest(
        `http://localhost:3000/api/data-fetching/posts/${nonExistentId}`,
        { method: 'DELETE' }
      );

      const response = await DELETE(request, { params: { id: nonExistentId } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty('error', 'Post not found');
    });

    it('should cascade delete comments when post is deleted', async () => {
      await db.comment.create({
        data: {
          text: 'Test comment',
          postId: testPostId,
          authorId: testUserId,
        },
      });

      const commentsBefore = await db.comment.findMany({
        where: { postId: testPostId },
      });
      expect(commentsBefore.length).toBe(1);

      const request = new NextRequest(
        `http://localhost:3000/api/data-fetching/posts/${testPostId}`,
        { method: 'DELETE' }
      );

      const response = await DELETE(request, { params: { id: testPostId } });
      expect(response.status).toBe(200);

      const commentsAfter = await db.comment.findMany({
        where: { postId: testPostId },
      });
      expect(commentsAfter.length).toBe(0);
    });
  });
});

