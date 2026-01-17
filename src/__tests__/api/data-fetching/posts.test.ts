import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/data-fetching/posts/route';
import { db } from '@/lib/db';

/**
 * API Tests for GET/POST /api/data-fetching/posts
 *
 * Tests both GET (fetch posts with pagination) and POST (create post) endpoints
 * Uses unit testing approach with mocked database for reliability and speed
 *
 * @see https://www.prisma.io/docs/orm/prisma-client/testing/unit-testing
 */

// Mock the database
vi.mock('@/lib/db', () => ({
  db: {
    post: {
      count: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
  },
}));

describe('GET /api/data-fetching/posts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Valid Requests', () => {
    it('should fetch all posts with default pagination', async () => {
      const mockPosts = [
        {
          id: 'post-1',
          title: 'Test Post 1',
          content: 'Test content 1',
          authorId: 'user-1',
          author: { id: 'user-1', name: 'John', email: 'john@example.com' },
          comments: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'post-2',
          title: 'Test Post 2',
          content: 'Test content 2',
          authorId: 'user-1',
          author: { id: 'user-1', name: 'John', email: 'john@example.com' },
          comments: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(db.post.count).mockResolvedValue(2);
      vi.mocked(db.post.findMany).mockResolvedValue(mockPosts);

      const request = new NextRequest('http://localhost:3000/api/data-fetching/posts', {
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('posts');
      expect(data).toHaveProperty('pagination');
      expect(Array.isArray(data.posts)).toBe(true);
      expect(data.posts.length).toBe(2);
      expect(data.pagination).toEqual({
        total: 2,
        page: 1,
        limit: 10,
        pages: 1,
      });
    });

    it('should support pagination with page and limit query parameters', async () => {
      const mockPosts = Array.from({ length: 5 }, (_, i) => ({
        id: `post-${i + 1}`,
        title: `Post ${i + 1}`,
        content: `Content ${i + 1}`,
        authorId: 'user-1',
        author: { id: 'user-1', name: 'John', email: 'john@example.com' },
        comments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      vi.mocked(db.post.count).mockResolvedValue(15);
      vi.mocked(db.post.findMany).mockResolvedValue(mockPosts);

      const request = new NextRequest(
        'http://localhost:3000/api/data-fetching/posts?page=2&limit=5',
        { method: 'GET' }
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.posts.length).toBe(5);
      expect(data.pagination.page).toBe(2);
      expect(data.pagination.limit).toBe(5);
      expect(data.pagination.pages).toBe(3);
    });

    it('should include author information in posts', async () => {
      const mockPosts = [
        {
          id: 'post-1',
          title: 'Post with Author',
          content: 'Test content',
          authorId: 'user-1',
          author: { id: 'user-1', name: 'John Doe', email: 'john@example.com' },
          comments: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(db.post.count).mockResolvedValue(1);
      vi.mocked(db.post.findMany).mockResolvedValue(mockPosts);

      const request = new NextRequest('http://localhost:3000/api/data-fetching/posts', {
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.posts[0]).toHaveProperty('author');
      expect(data.posts[0].author).toHaveProperty('id');
      expect(data.posts[0].author).toHaveProperty('name');
      expect(data.posts[0].author).toHaveProperty('email');
    });

    it('should include comment count in posts', async () => {
      const mockPosts = [
        {
          id: 'post-1',
          title: 'Post with Comments',
          content: 'Test content',
          authorId: 'user-1',
          author: { id: 'user-1', name: 'John', email: 'john@example.com' },
          comments: [{ id: 'c1' }, { id: 'c2' }, { id: 'c3' }],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(db.post.count).mockResolvedValue(1);
      vi.mocked(db.post.findMany).mockResolvedValue(mockPosts);

      const request = new NextRequest('http://localhost:3000/api/data-fetching/posts', {
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.posts[0]).toHaveProperty('comments');
      expect(data.posts[0].comments.length).toBe(3);
    });

    it('should enforce maximum limit of 100', async () => {
      vi.mocked(db.post.count).mockResolvedValue(0);
      vi.mocked(db.post.findMany).mockResolvedValue([]);

      const request = new NextRequest(
        'http://localhost:3000/api/data-fetching/posts?limit=500',
        { method: 'GET' }
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.pagination.limit).toBe(100);
    });

    it('should enforce minimum limit of 1', async () => {
      vi.mocked(db.post.count).mockResolvedValue(0);
      vi.mocked(db.post.findMany).mockResolvedValue([]);

      const request = new NextRequest(
        'http://localhost:3000/api/data-fetching/posts?limit=0',
        { method: 'GET' }
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.pagination.limit).toBe(1);
    });

    it('should sort posts by createdAt in descending order', async () => {
      const now = new Date();
      const mockPosts = [
        {
          id: 'post-2',
          title: 'Newer Post',
          content: 'Content 2',
          authorId: 'user-1',
          author: { id: 'user-1', name: 'John', email: 'john@example.com' },
          comments: [],
          createdAt: new Date(now.getTime() + 1000),
          updatedAt: new Date(),
        },
        {
          id: 'post-1',
          title: 'Older Post',
          content: 'Content 1',
          authorId: 'user-1',
          author: { id: 'user-1', name: 'John', email: 'john@example.com' },
          comments: [],
          createdAt: new Date(now.getTime() - 1000),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(db.post.count).mockResolvedValue(2);
      vi.mocked(db.post.findMany).mockResolvedValue(mockPosts);

      const request = new NextRequest('http://localhost:3000/api/data-fetching/posts', {
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.posts[0].id).toBe('post-2');
      expect(data.posts[1].id).toBe('post-1');
    });

    it('should return correct pagination metadata', async () => {
      const mockPosts = Array.from({ length: 10 }, (_, i) => ({
        id: `post-${i + 1}`,
        title: `Post ${i + 1}`,
        content: `Content ${i + 1}`,
        authorId: 'user-1',
        author: { id: 'user-1', name: 'John', email: 'john@example.com' },
        comments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      vi.mocked(db.post.count).mockResolvedValue(25);
      vi.mocked(db.post.findMany).mockResolvedValue(mockPosts);

      const request = new NextRequest(
        'http://localhost:3000/api/data-fetching/posts?page=1&limit=10',
        { method: 'GET' }
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.pagination.pages).toBe(3);
      expect(data.pagination.total).toBe(25);
    });

    it('should return empty array when no posts exist', async () => {
      vi.mocked(db.post.count).mockResolvedValue(0);
      vi.mocked(db.post.findMany).mockResolvedValue([]);

      const request = new NextRequest('http://localhost:3000/api/data-fetching/posts', {
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.posts).toEqual([]);
      expect(data.pagination.total).toBe(0);
    });
  });

  describe('Error Cases', () => {
    it('should handle invalid page parameter gracefully', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/data-fetching/posts?page=abc',
        { method: 'GET' }
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
      expect(data.error).toContain('Invalid pagination parameters');
    });

    it('should handle invalid limit parameter gracefully', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/data-fetching/posts?limit=invalid',
        { method: 'GET' }
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
      expect(data.error).toContain('Invalid pagination parameters');
    });

    it('should handle database errors gracefully', async () => {
      vi.mocked(db.post.count).mockRejectedValue(new Error('Database connection failed'));

      const request = new NextRequest('http://localhost:3000/api/data-fetching/posts', {
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toHaveProperty('error');
      expect(data.error).toContain('Failed to fetch posts');
    });
  });
});

describe('POST /api/data-fetching/posts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Valid Requests', () => {
    it('should create a new post with valid data', async () => {
      const mockUser = { id: 'user-1', name: 'John', email: 'john@example.com' };
      const mockPost = {
        id: 'post-1',
        title: 'New Test Post',
        content: 'This is test content',
        authorId: 'user-1',
        author: mockUser,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(db.user.findUnique).mockResolvedValue(mockUser as any);
      vi.mocked(db.post.create).mockResolvedValue(mockPost as any);

      const postData = {
        title: 'New Test Post',
        content: 'This is test content',
        authorId: 'user-1',
      };

      const request = new NextRequest('http://localhost:3000/api/data-fetching/posts', {
        method: 'POST',
        body: JSON.stringify(postData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toHaveProperty('id');
      expect(data.title).toBe(postData.title);
      expect(data.content).toBe(postData.content);
      expect(data.author.id).toBe('user-1');
    });

    it('should include author information in created post response', async () => {
      const mockUser = { id: 'user-1', name: 'John Doe', email: 'john@example.com' };
      const mockPost = {
        id: 'post-1',
        title: 'Post with author info',
        content: 'Testing author inclusion',
        authorId: 'user-1',
        author: mockUser,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(db.user.findUnique).mockResolvedValue(mockUser as any);
      vi.mocked(db.post.create).mockResolvedValue(mockPost as any);

      const postData = {
        title: 'Post with author info',
        content: 'Testing author inclusion',
        authorId: 'user-1',
      };

      const request = new NextRequest('http://localhost:3000/api/data-fetching/posts', {
        method: 'POST',
        body: JSON.stringify(postData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toHaveProperty('author');
      expect(data.author).toHaveProperty('id');
      expect(data.author).toHaveProperty('name');
      expect(data.author).toHaveProperty('email');
      expect(data.author.id).toBe('user-1');
    });

    it('should set timestamps on created post', async () => {
      const now = new Date();
      const mockUser = { id: 'user-1', name: 'John', email: 'john@example.com' };
      const mockPost = {
        id: 'post-1',
        title: 'Post with timestamps',
        content: 'Testing timestamp creation',
        authorId: 'user-1',
        author: mockUser,
        createdAt: now,
        updatedAt: now,
      };

      vi.mocked(db.user.findUnique).mockResolvedValue(mockUser as any);
      vi.mocked(db.post.create).mockResolvedValue(mockPost as any);

      const postData = {
        title: 'Post with timestamps',
        content: 'Testing timestamp creation',
        authorId: 'user-1',
      };

      const request = new NextRequest('http://localhost:3000/api/data-fetching/posts', {
        method: 'POST',
        body: JSON.stringify(postData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toHaveProperty('createdAt');
      expect(data).toHaveProperty('updatedAt');
      expect(typeof data.createdAt).toBe('string');
    });
  });

  describe('Validation Error Cases', () => {
    it('should return 400 when missing title', async () => {
      const postData = {
        content: 'Content without title',
        authorId: 'user-1',
      };

      const request = new NextRequest('http://localhost:3000/api/data-fetching/posts', {
        method: 'POST',
        body: JSON.stringify(postData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
      expect(data.error).toContain('title');
    });

    it('should return 400 when missing content', async () => {
      const postData = {
        title: 'Title without content',
        authorId: 'user-1',
      };

      const request = new NextRequest('http://localhost:3000/api/data-fetching/posts', {
        method: 'POST',
        body: JSON.stringify(postData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
      expect(data.error).toContain('content');
    });

    it('should return 400 when missing authorId', async () => {
      const postData = {
        title: 'Post without author',
        content: 'This post has no author',
      };

      const request = new NextRequest('http://localhost:3000/api/data-fetching/posts', {
        method: 'POST',
        body: JSON.stringify(postData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
      expect(data.error).toContain('authorId');
    });

    it('should return 400 when missing all required fields', async () => {
      const postData = {};

      const request = new NextRequest('http://localhost:3000/api/data-fetching/posts', {
        method: 'POST',
        body: JSON.stringify(postData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
    });
  });

  describe('Author Validation', () => {
    it('should return 404 when author does not exist', async () => {
      vi.mocked(db.user.findUnique).mockResolvedValue(null);

      const postData = {
        title: 'Post by non-existent author',
        content: 'This should fail',
        authorId: 'non-existent-user-id',
      };

      const request = new NextRequest('http://localhost:3000/api/data-fetching/posts', {
        method: 'POST',
        body: JSON.stringify(postData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty('error');
      expect(data.error).toContain('Author not found');
    });

    it('should verify author exists before creating post', async () => {
      vi.mocked(db.user.findUnique).mockResolvedValue(null);

      const postData = {
        title: 'Test',
        content: 'Test',
        authorId: 'invalid-user',
      };

      const request = new NextRequest('http://localhost:3000/api/data-fetching/posts', {
        method: 'POST',
        body: JSON.stringify(postData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(vi.mocked(db.post.create)).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should return 500 on unexpected database error', async () => {
      vi.mocked(db.user.findUnique).mockRejectedValue(new Error('Database connection failed'));

      const postData = {
        title: 'Test',
        content: 'Test',
        authorId: 'user-1',
      };

      const request = new NextRequest('http://localhost:3000/api/data-fetching/posts', {
        method: 'POST',
        body: JSON.stringify(postData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toHaveProperty('error');
      expect(data.error).toContain('Failed to create post');
    });

    it('should handle invalid JSON body', async () => {
      const request = new NextRequest('http://localhost:3000/api/data-fetching/posts', {
        method: 'POST',
        body: 'invalid json {',
      });

      const response = await POST(request);
      expect([400, 500]).toContain(response.status);
    });
  });
});
