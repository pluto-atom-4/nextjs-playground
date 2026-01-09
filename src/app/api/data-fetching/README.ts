/**
 * Data Fetching API Routes
 *
 * This directory contains API endpoints that demonstrate various data fetching patterns
 * used in the data-fetching showcase.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/route-handlers
 * @see https://nextjs.org/docs/app/getting-started/fetching-data
 */

/**
 * API Routes Overview
 *
 * GET    /api/data-fetching/posts              - List all posts (with pagination)
 * POST   /api/data-fetching/posts              - Create new post
 * GET    /api/data-fetching/posts/[id]         - Get single post with comments
 * PUT    /api/data-fetching/posts/[id]         - Update post
 * DELETE /api/data-fetching/posts/[id]         - Delete post
 * GET    /api/data-fetching/posts/[id]/comments - Get comments for post
 * POST   /api/data-fetching/posts/[id]/comments - Create comment
 * GET    /api/data-fetching/search             - Search posts
 * GET    /api/data-fetching/metrics            - Get performance metrics
 * GET    /api/data-fetching/simulate-delay     - Simulate slow endpoint
 */

/**
 * Route Parameters
 *
 * @param {string} id - Post ID (CUID format from Prisma)
 *
 * @example
 * // Get a specific post
 * GET /api/data-fetching/posts/cuid123
 */

/**
 * Query Parameters
 *
 * @query {number} [page=1] - Page number for pagination (GET /posts)
 * @query {number} [limit=10] - Items per page (GET /posts)
 * @query {string} q - Search query (GET /search)
 * @query {number} [delay=1000] - Delay in milliseconds (GET /simulate-delay)
 * @query {string} [category] - Optional category filter (GET /simulate-delay)
 *
 * @example
 * // Get page 2 with 20 items per page
 * GET /api/data-fetching/posts?page=2&limit=20
 *
 * @example
 * // Search for TypeScript posts
 * GET /api/data-fetching/search?q=typescript&limit=20
 *
 * @example
 * // Simulate a 3-second delay
 * GET /api/data-fetching/simulate-delay?delay=3000
 */

/**
 * Request/Response Examples
 *
 * ## GET /api/data-fetching/posts
 * Query: ?page=1&limit=10
 *
 * Response (200):
 * {
 *   "posts": [
 *     {
 *       "id": "cuid123",
 *       "title": "Getting Started with Next.js",
 *       "content": "...",
 *       "author": { "id": "...", "name": "John", "email": "john@example.com" },
 *       "comments": [...],
 *       "createdAt": "2025-01-01T00:00:00Z",
 *       "updatedAt": "2025-01-01T00:00:00Z"
 *     }
 *   ],
 *   "pagination": {
 *     "total": 50,
 *     "page": 1,
 *     "limit": 10,
 *     "pages": 5
 *   }
 * }
 *
 * ## POST /api/data-fetching/posts
 * Body: { "title": "...", "content": "...", "authorId": "..." }
 * Response (201): { "id": "...", "title": "...", ... }
 *
 * ## GET /api/data-fetching/posts/[id]
 * Response (200): { "id": "...", "title": "...", "author": {...}, "comments": [...] }
 * Response (404): { "error": "Post not found" }
 *
 * ## PUT /api/data-fetching/posts/[id]
 * Body: { "title": "Updated title" }
 * Response (200): { "id": "...", "title": "Updated title", ... }
 *
 * ## DELETE /api/data-fetching/posts/[id]
 * Response (200): { "message": "Post deleted", "id": "..." }
 *
 * ## GET /api/data-fetching/posts/[id]/comments
 * Response (200): { "postId": "...", "total": 5, "comments": [...] }
 *
 * ## POST /api/data-fetching/posts/[id]/comments
 * Body: { "text": "Great post!", "authorId": "..." }
 * Response (201): { "id": "...", "text": "Great post!", "author": {...} }
 *
 * ## GET /api/data-fetching/search
 * Query: ?q=typescript&limit=20
 * Response (200): { "query": "typescript", "results": [...], "count": 3 }
 *
 * ## GET /api/data-fetching/metrics
 * Response (200): {
 *   "database": { "posts": 50, "users": 10, "comments": 200 },
 *   "performance": { "avgResponseTime": 45, "p95ResponseTime": 120, ... },
 *   "cache": { "cacheHits": 150, "cacheMisses": 45, "hitRate": 77 },
 *   "recent": { "totalRequests": 1000, "recentRequests": [...] }
 * }
 *
 * ## GET /api/data-fetching/simulate-delay
 * Query: ?delay=3000
 * Response (200): {
 *   "id": "...",
 *   "title": "Delayed Response (3000ms)",
 *   "delay": 3000,
 *   "actualDelay": 3005,
 *   "timestamp": "2025-01-08T12:00:00Z"
 * }
 */

/**
 * Error Responses
 *
 * ### 400 Bad Request
 * Occurs when:
 * - Invalid pagination parameters
 * - Missing required fields in POST/PUT body
 * - Invalid search query
 * - Invalid delay parameter
 *
 * Response:
 * { "error": "Invalid pagination parameters" }
 *
 * ### 404 Not Found
 * Occurs when:
 * - Post ID does not exist
 * - Author ID does not exist (when creating post)
 * - Post not found (when searching or getting comments)
 *
 * Response:
 * { "error": "Post not found" }
 *
 * ### 500 Internal Server Error
 * Occurs when:
 * - Database connection fails
 * - Unexpected error during query
 *
 * Response:
 * { "error": "Failed to fetch posts" }
 */

export {};

