import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET } from '@/app/api/data-fetching/search/route';
import { db } from '@/lib/db';
import { NextRequest } from 'next/server';

// Mock database
vi.mock('@/lib/db', () => ({
  db: {
    post: {
      findMany: vi.fn(),
    },
  },
}));

describe('GET /api/data-fetching/search', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Valid search requests', () => {
    it('should return posts matching search query (title)', async () => {
      const mockPosts = [
        {
          id: '1',
          title: 'TypeScript Tips',
          content: 'Learn TypeScript best practices',
          authorId: 'author-1',
          author: { id: 'author-1', name: 'John', email: 'john@example.com' },
          comments: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(db.post.findMany).mockResolvedValue(mockPosts);

      const request = new NextRequest('http://localhost/api/data-fetching/search?q=typescript');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.query).toBe('typescript');
      expect(data.count).toBe(1);
      expect(data.results).toHaveLength(1);
      expect(data.results[0].id).toBe('1');
      expect(data.results[0].title).toBe('TypeScript Tips');
      expect(data.results[0].author.name).toBe('John');
    });

    it('should return posts matching search query (content)', async () => {
      const mockPosts = [
        {
          id: '2',
          title: 'React Guide',
          content: 'React is a JavaScript library',
          authorId: 'author-2',
          author: { id: 'author-2', name: 'Jane', email: 'jane@example.com' },
          comments: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(db.post.findMany).mockResolvedValue(mockPosts);

      const request = new NextRequest('http://localhost/api/data-fetching/search?q=javascript');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.query).toBe('javascript');
      expect(data.count).toBe(1);
      expect(data.results).toHaveLength(1);
      expect(data.results[0].title).toBe('React Guide');
      expect(data.results[0].content).toContain('JavaScript');
    });

    it('should handle case-insensitive search', async () => {
      const mockPosts = [
        {
          id: '3',
          title: 'NEXT.JS Tutorial',
          content: 'Building apps with Next.js',
          authorId: 'author-1',
          author: { id: 'author-1', name: 'John', email: 'john@example.com' },
          comments: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(db.post.findMany).mockResolvedValue(mockPosts);

      const request = new NextRequest('http://localhost/api/data-fetching/search?q=next.js');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.results).toHaveLength(1);
      expect(data.results[0].title).toContain('NEXT');
    });

    it('should return multiple matching posts', async () => {
      const mockPosts = [
        {
          id: '4',
          title: 'Node Post 1',
          content: 'First Node.js article',
          authorId: 'author-1',
          author: { id: 'author-1', name: 'John', email: 'john@example.com' },
          comments: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '5',
          title: 'Node Post 2',
          content: 'Second Node.js article',
          authorId: 'author-2',
          author: { id: 'author-2', name: 'Jane', email: 'jane@example.com' },
          comments: [{ id: 'c1' }, { id: 'c2' }],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(db.post.findMany).mockResolvedValue(mockPosts);

      const request = new NextRequest('http://localhost/api/data-fetching/search?q=node');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.count).toBe(2);
      expect(data.results).toHaveLength(2);
      expect(data.results[0].id).toBe('4');
      expect(data.results[1].id).toBe('5');
      expect(data.results[1].comments).toHaveLength(2);
    });

    it('should return empty array when no matches found', async () => {
      vi.mocked(db.post.findMany).mockResolvedValue([]);

      const request = new NextRequest('http://localhost/api/data-fetching/search?q=nonexistent');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.count).toBe(0);
      expect(data.results).toEqual([]);
    });

    it('should respect limit parameter', async () => {
      const mockPosts = [
        {
          id: '6',
          title: 'Post 1',
          content: 'Content 1',
          authorId: 'author-1',
          author: { id: 'author-1', name: 'John', email: 'john@example.com' },
          comments: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(db.post.findMany).mockResolvedValue(mockPosts);

      const request = new NextRequest('http://localhost/api/data-fetching/search?q=post&limit=5');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.limit).toBe(5);
    });

    it('should enforce limit maximum of 100', async () => {
      vi.mocked(db.post.findMany).mockResolvedValue([]);

      const request = new NextRequest('http://localhost/api/data-fetching/search?q=test&limit=500');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.limit).toBe(100);
    });

    it('should use default limit of 20 when not specified', async () => {
      vi.mocked(db.post.findMany).mockResolvedValue([]);

      const request = new NextRequest('http://localhost/api/data-fetching/search?q=test');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.limit).toBe(20);
    });

    it('should enforce limit minimum of 1', async () => {
      vi.mocked(db.post.findMany).mockResolvedValue([]);

      const request = new NextRequest('http://localhost/api/data-fetching/search?q=test&limit=0');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.limit).toBe(1);
    });

    it('should include author information in results', async () => {
      const mockPosts = [
        {
          id: '7',
          title: 'Author Post',
          content: 'Post with author',
          authorId: 'author-1',
          author: { id: 'author-1', name: 'John Doe', email: 'john@example.com' },
          comments: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(db.post.findMany).mockResolvedValue(mockPosts);

      const request = new NextRequest('http://localhost/api/data-fetching/search?q=author');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.results[0].author).toEqual({
        id: 'author-1',
        name: 'John Doe',
        email: 'john@example.com',
      });
    });

    it('should include comment count in results', async () => {
      const mockPosts = [
        {
          id: '8',
          title: 'Post with Comments',
          content: 'This post has comments',
          authorId: 'author-1',
          author: { id: 'author-1', name: 'John', email: 'john@example.com' },
          comments: [{ id: 'c1' }, { id: 'c2' }, { id: 'c3' }],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(db.post.findMany).mockResolvedValue(mockPosts);

      const request = new NextRequest('http://localhost/api/data-fetching/search?q=comments');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.results[0].comments).toHaveLength(3);
    });

    it('should trim whitespace from query', async () => {
      vi.mocked(db.post.findMany).mockResolvedValue([]);

      const request = new NextRequest('http://localhost/api/data-fetching/search?q=%20%20test%20%20');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.query).toBe('test');
    });
  });

  describe('Error cases', () => {
    it('should return 400 when query parameter is missing', async () => {
      const request = new NextRequest('http://localhost/api/data-fetching/search');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Search query is required');
    });

    it('should return 400 when query parameter is empty', async () => {
      const request = new NextRequest('http://localhost/api/data-fetching/search?q=');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Search query is required');
    });

    it('should return 400 when query parameter is only whitespace', async () => {
      const request = new NextRequest('http://localhost/api/data-fetching/search?q=%20%20%20');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Search query is required');
    });

    it('should return 400 when limit is invalid', async () => {
      const request = new NextRequest('http://localhost/api/data-fetching/search?q=test&limit=invalid');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Invalid limit parameter');
    });

    it('should return 500 when database error occurs', async () => {
      vi.mocked(db.post.findMany).mockRejectedValue(new Error('Database connection failed'));

      const request = new NextRequest('http://localhost/api/data-fetching/search?q=test');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain('Failed to search posts');
    });
  });

  describe('Query parameter combinations', () => {
    it('should handle search with custom limit', async () => {
      vi.mocked(db.post.findMany).mockResolvedValue([]);

      const request = new NextRequest('http://localhost/api/data-fetching/search?q=typescript&limit=15');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.query).toBe('typescript');
      expect(data.limit).toBe(15);
    });

    it('should order results by creation date (descending)', async () => {
      const now = new Date();
      const mockPosts = [
        {
          id: '9',
          title: 'Newest Post',
          content: 'Most recent',
          authorId: 'author-1',
          author: { id: 'author-1', name: 'John', email: 'john@example.com' },
          comments: [],
          createdAt: new Date(now.getTime() + 1000),
          updatedAt: new Date(),
        },
        {
          id: '10',
          title: 'Older Post',
          content: 'Less recent',
          authorId: 'author-1',
          author: { id: 'author-1', name: 'John', email: 'john@example.com' },
          comments: [],
          createdAt: new Date(now.getTime() - 1000),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(db.post.findMany).mockResolvedValue(mockPosts);

      const request = new NextRequest('http://localhost/api/data-fetching/search?q=post');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.results[0].id).toBe('9');
      expect(data.results[1].id).toBe('10');
    });
  });
});

