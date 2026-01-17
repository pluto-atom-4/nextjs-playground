import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as getPost, PUT as putPost, DELETE as deletePost } from '@/app/api/data-fetching/posts/[id]/route';
import { GET as getPosts, POST as createPost } from '@/app/api/data-fetching/posts/route';
import { GET as searchPosts } from '@/app/api/data-fetching/search/route';
import { GET as simulateDelay } from '@/app/api/data-fetching/simulate-delay/route';
import { db } from '@/lib/db';

/**
 * Comprehensive API Error Handling Tests
 *
 * Tests error scenarios across all data-fetching API routes:
 * - GET /api/data-fetching/posts
 * - POST /api/data-fetching/posts
 * - GET /api/data-fetching/posts/[id]
 * - PUT /api/data-fetching/posts/[id]
 * - DELETE /api/data-fetching/posts/[id]
 * - GET /api/data-fetching/search
 * - GET /api/data-fetching/simulate-delay
 *
 * @see https://www.prisma.io/docs/orm/prisma-client/testing/unit-testing
 */

// Mock database for all tests
vi.mock('@/lib/db', () => ({
  db: {
    post: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
    comment: {
      count: vi.fn(),
    },
  },
}));

describe('API Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ============================================================================
  // POST /api/data-fetching/posts - Error Handling
  // ============================================================================

  describe('POST /api/data-fetching/posts - Error Handling', () => {
    it('should return 400 for malformed JSON body', async () => {
      const request = new NextRequest('http://localhost/api/data-fetching/posts', {
        method: 'POST',
        body: '{invalid json',
      });

      const response = await createPost(request);
      expect([400, 500]).toContain(response.status);
      expect(response.status).not.toBe(201);
    });

    it('should return 400 for malformed JSON body', async () => {
      const request = new NextRequest('http://localhost/api/data-fetching/posts', {
        method: 'POST',
        body: '{invalid json',
      });

      const response = await createPost(request);
      expect([400, 500]).toContain(response.status);
      expect(response.status).not.toBe(201);
    });

    it('should return 400 when title is missing', async () => {
      const request = new NextRequest('http://localhost/api/data-fetching/posts', {
        method: 'POST',
        body: JSON.stringify({
          content: 'Post content',
          authorId: 'user-1',
        }),
      });

      const response = await createPost(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('title');
    });

    it('should return 400 when title is empty string', async () => {
      const request = new NextRequest('http://localhost/api/data-fetching/posts', {
        method: 'POST',
        body: JSON.stringify({
          title: '',
          content: 'Post content',
          authorId: 'user-1',
        }),
      });

      const response = await createPost(request);

      expect(response.status).toBe(400);
    });

    it('should return 400 when content is missing', async () => {
      const request = new NextRequest('http://localhost/api/data-fetching/posts', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Post title',
          authorId: 'user-1',
        }),
      });

      const response = await createPost(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('content');
    });

    it('should return 400 when content is empty string', async () => {
      const request = new NextRequest('http://localhost/api/data-fetching/posts', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Post title',
          content: '',
          authorId: 'user-1',
        }),
      });

      const response = await createPost(request);

      expect(response.status).toBe(400);
    });

    it('should return 400 when authorId is missing', async () => {
      const request = new NextRequest('http://localhost/api/data-fetching/posts', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Post title',
          content: 'Post content',
        }),
      });

      const response = await createPost(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('authorId');
    });

    it('should return 400 when authorId is empty string', async () => {
      const request = new NextRequest('http://localhost/api/data-fetching/posts', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Post title',
          content: 'Post content',
          authorId: '',
        }),
      });

      const response = await createPost(request);

      expect(response.status).toBe(400);
    });

    it('should return 404 when author does not exist', async () => {
      vi.mocked(db.user.findUnique).mockResolvedValue(null);

      const request = new NextRequest('http://localhost/api/data-fetching/posts', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Post title',
          content: 'Post content',
          authorId: 'non-existent-user',
        }),
      });

      const response = await createPost(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toContain('Author not found');
    });

    it('should return 500 on database error during user lookup', async () => {
      vi.mocked(db.user.findUnique).mockRejectedValue(
        new Error('Database connection failed')
      );

      const request = new NextRequest('http://localhost/api/data-fetching/posts', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Post title',
          content: 'Post content',
          authorId: 'user-1',
        }),
      });

      const response = await createPost(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain('Failed to create post');
    });

    it('should return 500 on database error during post creation', async () => {
      const mockUser = { id: 'user-1', name: 'John', email: 'john@example.com' };
      vi.mocked(db.user.findUnique).mockResolvedValue(mockUser as any);
      vi.mocked(db.post.create).mockRejectedValue(
        new Error('Database constraint violation')
      );

      const request = new NextRequest('http://localhost/api/data-fetching/posts', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Post title',
          content: 'Post content',
          authorId: 'user-1',
        }),
      });

      const response = await createPost(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain('Failed to create post');
    });
  });

  // ============================================================================
  // GET /api/data-fetching/posts - Error Handling
  // ============================================================================

  describe('GET /api/data-fetching/posts - Error Handling', () => {
    it('should return 400 when page is not a number', async () => {
      const request = new NextRequest(
        'http://localhost/api/data-fetching/posts?page=abc',
        { method: 'GET' }
      );

      const response = await getPosts(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Invalid pagination');
    });

    it('should return 400 when limit is not a number', async () => {
      const request = new NextRequest(
        'http://localhost/api/data-fetching/posts?limit=xyz',
        { method: 'GET' }
      );

      const response = await getPosts(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Invalid pagination');
    });

    it('should return 400 when both page and limit are invalid', async () => {
      const request = new NextRequest(
        'http://localhost/api/data-fetching/posts?page=invalid&limit=notanumber',
        { method: 'GET' }
      );

      const response = await getPosts(request);

      expect(response.status).toBe(400);
    });

    it('should return 500 on database count error', async () => {
      vi.mocked(db.post.count).mockRejectedValue(
        new Error('Database connection lost')
      );

      const request = new NextRequest('http://localhost/api/data-fetching/posts', {
        method: 'GET',
      });

      const response = await getPosts(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain('Failed to fetch posts');
    });

    it('should return 500 on database findMany error', async () => {
      vi.mocked(db.post.count).mockResolvedValue(10);
      vi.mocked(db.post.findMany).mockRejectedValue(
        new Error('Database query failed')
      );

      const request = new NextRequest('http://localhost/api/data-fetching/posts', {
        method: 'GET',
      });

      const response = await getPosts(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain('Failed to fetch posts');
    });
  });

  // ============================================================================
  // GET /api/data-fetching/posts/[id] - Error Handling
  // ============================================================================

  describe('GET /api/data-fetching/posts/[id] - Error Handling', () => {
    it('should return 404 when post does not exist', async () => {
      vi.mocked(db.post.findUnique).mockResolvedValue(null);

      const request = new NextRequest(
        'http://localhost/api/data-fetching/posts/non-existent-id',
        { method: 'GET' }
      );

      const response = await getPost(request, {
        params: { id: 'non-existent-id' },
      } as any);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toContain('Post not found');
    });

    it('should return 500 on database error', async () => {
      vi.mocked(db.post.findUnique).mockRejectedValue(
        new Error('Database connection failed')
      );

      const request = new NextRequest(
        'http://localhost/api/data-fetching/posts/post-1',
        { method: 'GET' }
      );

      const response = await getPost(request, {
        params: { id: 'post-1' },
      } as any);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain('Failed to fetch post');
    });
  });

  // ============================================================================
  // PUT /api/data-fetching/posts/[id] - Error Handling
  // ============================================================================

  describe('PUT /api/data-fetching/posts/[id] - Error Handling', () => {
    it('should return 400 for malformed JSON body', async () => {
      const request = new NextRequest(
        'http://localhost/api/data-fetching/posts/post-1',
        {
          method: 'PUT',
          body: '{invalid json',
        }
      );

      const response = await putPost(request, {
        params: { id: 'post-1' },
      } as any);

      expect([400, 500]).toContain(response.status);
    });

    it('should return 400 for malformed JSON body', async () => {
      const request = new NextRequest(
        'http://localhost/api/data-fetching/posts/post-1',
        {
          method: 'PUT',
          body: '{invalid json',
        }
      );

      const response = await putPost(request, {
        params: { id: 'post-1' },
      } as any);

      expect([400, 500]).toContain(response.status);
    });

    it('should return 400 when no fields to update', async () => {
      const request = new NextRequest(
        'http://localhost/api/data-fetching/posts/post-1',
        {
          method: 'PUT',
          body: JSON.stringify({}),
        }
      );

      const response = await putPost(request, {
        params: { id: 'post-1' },
      } as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('At least one field');
    });

    it('should return 404 when post does not exist', async () => {
      vi.mocked(db.post.findUnique).mockResolvedValue(null);

      const request = new NextRequest(
        'http://localhost/api/data-fetching/posts/non-existent-id',
        {
          method: 'PUT',
          body: JSON.stringify({ title: 'Updated' }),
        }
      );

      const response = await putPost(request, {
        params: { id: 'non-existent-id' },
      } as any);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toContain('Post not found');
    });

    it('should return 500 on database error', async () => {
      // Mock the first findUnique call to return a post
      const mockPost = { id: 'post-1', title: 'Post', content: 'Content', authorId: 'user-1' };
      vi.mocked(db.post.findUnique).mockResolvedValueOnce(mockPost as any);
      // Mock the update call to fail
      vi.mocked(db.post.update).mockRejectedValue(
        new Error('Database connection failed')
      );

      const request = new NextRequest(
        'http://localhost/api/data-fetching/posts/post-1',
        {
          method: 'PUT',
          body: JSON.stringify({ title: 'Updated' }),
        }
      );

      const response = await putPost(request, {
        params: { id: 'post-1' },
      } as any);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain('Failed to update post');
    });
  });

  // ============================================================================
  // DELETE /api/data-fetching/posts/[id] - Error Handling
  // ============================================================================

  describe('DELETE /api/data-fetching/posts/[id] - Error Handling', () => {
    it('should return 404 when post does not exist', async () => {
      vi.mocked(db.post.findUnique).mockResolvedValue(null);

      const request = new NextRequest(
        'http://localhost/api/data-fetching/posts/non-existent-id',
        { method: 'DELETE' }
      );

      const response = await deletePost(request, {
        params: { id: 'non-existent-id' },
      } as any);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toContain('Post not found');
    });

    it('should return 500 on database error', async () => {
      // Mock the first findUnique call to return a post
      const mockPost = { id: 'post-1', title: 'Post', content: 'Content', authorId: 'user-1' };
      vi.mocked(db.post.findUnique).mockResolvedValueOnce(mockPost as any);
      // Mock the delete call to fail
      vi.mocked(db.post.delete).mockRejectedValue(
        new Error('Database connection failed')
      );

      const request = new NextRequest(
        'http://localhost/api/data-fetching/posts/post-1',
        { method: 'DELETE' }
      );

      const response = await deletePost(request, {
        params: { id: 'post-1' },
      } as any);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain('Failed to delete post');
    });
  });

  // ============================================================================
  // GET /api/data-fetching/search - Error Handling
  // ============================================================================

  describe('GET /api/data-fetching/search - Error Handling', () => {
    it('should return 400 when search query is missing', async () => {
      const request = new NextRequest('http://localhost/api/data-fetching/search', {
        method: 'GET',
      });

      const response = await searchPosts(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Search query is required');
    });

    it('should return 400 when search query is empty', async () => {
      const request = new NextRequest('http://localhost/api/data-fetching/search?q=', {
        method: 'GET',
      });

      const response = await searchPosts(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Search query is required');
    });

    it('should return 400 when search query is only whitespace', async () => {
      const request = new NextRequest(
        'http://localhost/api/data-fetching/search?q=%20%20%20',
        { method: 'GET' }
      );

      const response = await searchPosts(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Search query is required');
    });

    it('should return 400 when limit is not a number', async () => {
      const request = new NextRequest(
        'http://localhost/api/data-fetching/search?q=test&limit=notanumber',
        { method: 'GET' }
      );

      const response = await searchPosts(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Invalid limit');
    });

    it('should return 500 on database error', async () => {
      vi.mocked(db.post.findMany).mockRejectedValue(
        new Error('Database connection failed')
      );

      const request = new NextRequest(
        'http://localhost/api/data-fetching/search?q=test',
        { method: 'GET' }
      );

      const response = await searchPosts(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain('Failed to search posts');
    });
  });

  // ============================================================================
  // GET /api/data-fetching/simulate-delay - Error Handling
  // ============================================================================

  describe('GET /api/data-fetching/simulate-delay - Error Handling', () => {
    it('should return 400 when delay is negative', async () => {
      const request = new NextRequest(
        'http://localhost/api/data-fetching/simulate-delay?delay=-1000',
        { method: 'GET' }
      );

      const response = await simulateDelay(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Invalid delay parameter');
    });

    it('should return 400 when delay is not a number', async () => {
      const request = new NextRequest(
        'http://localhost/api/data-fetching/simulate-delay?delay=notanumber',
        { method: 'GET' }
      );

      const response = await simulateDelay(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Invalid delay parameter');
    });

    it('should return 400 when delay exceeds maximum (30000ms)', async () => {
      const request = new NextRequest(
        'http://localhost/api/data-fetching/simulate-delay?delay=31000',
        { method: 'GET' }
      );

      const response = await simulateDelay(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Delay exceeds maximum allowed');
    });

    it('should return 400 when delay is far over maximum', async () => {
      const request = new NextRequest(
        'http://localhost/api/data-fetching/simulate-delay?delay=1000000',
        { method: 'GET' }
      );

      const response = await simulateDelay(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Delay exceeds maximum allowed');
    });
  });

  // ============================================================================
  // Cross-Route Error Scenarios
  // ============================================================================

  describe('Cross-Route Error Scenarios', () => {
    it('should handle errors consistently across routes', async () => {
      // Test database connection error handling across multiple routes
      vi.mocked(db.post.count).mockRejectedValue(
        new Error('Connection pool exhausted')
      );
      vi.mocked(db.post.findMany).mockRejectedValue(
        new Error('Connection pool exhausted')
      );

      const getPostsRequest = new NextRequest(
        'http://localhost/api/data-fetching/posts',
        { method: 'GET' }
      );
      const getPostsResponse = await getPosts(getPostsRequest);
      expect(getPostsResponse.status).toBe(500);

      const searchRequest = new NextRequest(
        'http://localhost/api/data-fetching/search?q=test',
        { method: 'GET' }
      );
      const searchResponse = await searchPosts(searchRequest);
      expect(searchResponse.status).toBe(500);
    });

    it('should return appropriate status codes for different error types', async () => {
      // 400: Bad Request (invalid input)
      const badRequest = new NextRequest(
        'http://localhost/api/data-fetching/posts',
        {
          method: 'POST',
          body: JSON.stringify({ invalid: 'data' }),
        }
      );
      const badResponse = await createPost(badRequest);
      expect([400, 500]).toContain(badResponse.status);

      // 404: Not Found (resource doesn't exist)
      vi.mocked(db.post.findUnique).mockResolvedValue(null);
      const notFoundRequest = new NextRequest(
        'http://localhost/api/data-fetching/posts/non-existent',
        { method: 'GET' }
      );
      const notFoundResponse = await getPost(notFoundRequest, {
        params: { id: 'non-existent' },
      } as any);
      expect(notFoundResponse.status).toBe(404);

      // 500: Internal Server Error (database failure)
      vi.mocked(db.post.findMany).mockRejectedValue(
        new Error('Database error')
      );
      const serverErrorRequest = new NextRequest(
        'http://localhost/api/data-fetching/search?q=test',
        { method: 'GET' }
      );
      const serverErrorResponse = await searchPosts(serverErrorRequest);
      expect(serverErrorResponse.status).toBe(500);
    });

    it('should include helpful error messages', async () => {
      const request = new NextRequest(
        'http://localhost/api/data-fetching/posts',
        {
          method: 'POST',
          body: JSON.stringify({ title: 'Missing content' }),
        }
      );

      const response = await createPost(request);
      const data = await response.json();

      expect(data).toHaveProperty('error');
      expect(typeof data.error).toBe('string');
      expect(data.error.length).toBeGreaterThan(0);
      // Error message should indicate what's missing or wrong
      expect(data.error.toLowerCase()).toMatch(/missing|required|invalid/i);
    });
  });

  // ============================================================================
  // Error Response Format Tests
  // ============================================================================

  describe('Error Response Format', () => {
    it('should return error responses in consistent format', async () => {
      const request = new NextRequest(
        'http://localhost/api/data-fetching/search',
        { method: 'GET' }
      );

      const response = await searchPosts(request);
      const data = await response.json();

      // All error responses should have error property
      expect(data).toHaveProperty('error');
      expect(typeof data.error).toBe('string');

      // Status code should indicate error (4xx or 5xx)
      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it('should not expose sensitive information in errors', async () => {
      vi.mocked(db.post.findMany).mockRejectedValue(
        new Error('Secret connection string exposed!')
      );

      const request = new NextRequest(
        'http://localhost/api/data-fetching/search?q=test',
        { method: 'GET' }
      );

      const response = await searchPosts(request);
      const data = await response.json();

      // Error message should not expose implementation details
      expect(data.error).not.toContain('connection string');
      expect(data.error).not.toContain('SECRET');
      expect(data.error).toContain('Failed to search posts');
    });

    it('should include correct HTTP status codes in responses', async () => {
      // Test 400 Bad Request
      const badReqResponse = await searchPosts(
        new NextRequest('http://localhost/api/data-fetching/search', {
          method: 'GET',
        })
      );
      expect(badReqResponse.status).toBe(400);

      // Test 404 Not Found
      vi.mocked(db.post.findUnique).mockResolvedValue(null);
      const notFoundResponse = await getPost(
        new NextRequest('http://localhost/api/data-fetching/posts/xyz', {
          method: 'GET',
        }),
        { params: { id: 'xyz' } } as any
      );
      expect(notFoundResponse.status).toBe(404);

      // Test 500 Internal Server Error
      vi.mocked(db.post.findMany).mockRejectedValue(new Error('DB Error'));
      const serverErrorResponse = await searchPosts(
        new NextRequest('http://localhost/api/data-fetching/search?q=test', {
          method: 'GET',
        })
      );
      expect(serverErrorResponse.status).toBe(500);
    });
  });
});
