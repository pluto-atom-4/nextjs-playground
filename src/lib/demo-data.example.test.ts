/**
 * Example Usage and Test Cases for demo-data.ts
 *
 * This file demonstrates how to use the mock data factories in various scenarios:
 * - Unit tests
 * - Component development
 * - E2E test fixtures
 * - Storybook stories
 *
 * Run with: pnpm test src/lib/demo-data.example.test.ts
 */

import { describe, it, expect } from 'vitest';
import {
  createUser,
  createUsersBatch,
  createPost,
  createPostsBatch,
  createComment,
  createCommentsBatch,
  createDemoDataset,
  createMinimalDataset,
  createLargeDataset,
} from './demo-data';

describe('Demo Data Factories', () => {
  // =========================================================================
  // User Factory Tests
  // =========================================================================

  describe('User Factory', () => {
    it('should create a user with default values', () => {
      const user = createUser();

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.email).toBeDefined();
      expect(user.name).toBeDefined();
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should create a user with custom overrides', () => {
      const user = createUser({
        email: 'custom@example.com',
        name: 'Custom User',
      });

      expect(user.email).toBe('custom@example.com');
      expect(user.name).toBe('Custom User');
    });

    it('should create unique user IDs', () => {
      const user1 = createUser();
      const user2 = createUser();

      expect(user1.id).not.toBe(user2.id);
    });

    it('should create a batch of users', () => {
      const users = createUsersBatch(5);

      expect(users).toHaveLength(5);
      expect(users.every(u => u.id)).toBe(true);
      expect(users.every(u => u.email)).toBe(true);
    });

    it('should apply overrides to all users in batch', () => {
      const authorId = 'test-author-id';
      const users = createUsersBatch(3, { id: authorId });

      expect(users.every(u => u.id === authorId)).toBe(true);
    });
  });

  // =========================================================================
  // Post Factory Tests
  // =========================================================================

  describe('Post Factory', () => {
    it('should create a post with default values', () => {
      const post = createPost();

      expect(post).toBeDefined();
      expect(post.id).toBeDefined();
      expect(post.title).toBeDefined();
      expect(post.content).toBeDefined();
      expect(post.authorId).toBeDefined();
      expect(post.createdAt).toBeInstanceOf(Date);
      expect(post.updatedAt).toBeInstanceOf(Date);
    });

    it('should create a post with custom properties', () => {
      const authorId = 'author-123';
      const post = createPost({
        title: 'Custom Title',
        content: 'Custom content here',
        authorId,
      });

      expect(post.title).toBe('Custom Title');
      expect(post.content).toBe('Custom content here');
      expect(post.authorId).toBe(authorId);
    });

    it('should create a batch of posts for an author', () => {
      const authorId = 'author-123';
      const posts = createPostsBatch(5, { authorId });

      expect(posts).toHaveLength(5);
      expect(posts.every(p => p.authorId === authorId)).toBe(true);
      expect(new Set(posts.map(p => p.id)).size).toBe(5); // All unique
    });

    it('should have sequential timestamps in batch', () => {
      const posts = createPostsBatch(3);

      // Last post should be earlier than first
      expect(posts[2].createdAt.getTime()).toBeLessThan(posts[0].createdAt.getTime());
    });
  });

  // =========================================================================
  // Comment Factory Tests
  // =========================================================================

  describe('Comment Factory', () => {
    it('should create a comment with default values', () => {
      const comment = createComment();

      expect(comment).toBeDefined();
      expect(comment.id).toBeDefined();
      expect(comment.text).toBeDefined();
      expect(comment.postId).toBeDefined();
      expect(comment.authorId).toBeDefined();
      expect(comment.createdAt).toBeInstanceOf(Date);
      expect(comment.updatedAt).toBeInstanceOf(Date);
    });

    it('should create a comment with relationships', () => {
      const postId = 'post-123';
      const authorId = 'user-456';
      const comment = createComment({
        text: 'My comment',
        postId,
        authorId,
      });

      expect(comment.text).toBe('My comment');
      expect(comment.postId).toBe(postId);
      expect(comment.authorId).toBe(authorId);
    });

    it('should create a batch of comments on a post', () => {
      const postId = 'post-123';
      const comments = createCommentsBatch(5, { postId });

      expect(comments).toHaveLength(5);
      expect(comments.every(c => c.postId === postId)).toBe(true);
      expect(new Set(comments.map(c => c.id)).size).toBe(5); // All unique
    });

    it('should vary comment text in batch', () => {
      const comments = createCommentsBatch(8);

      // Should have different comment texts
      const texts = comments.map(c => c.text);
      expect(new Set(texts).size).toBeGreaterThan(1);
    });
  });

  // =========================================================================
  // Dataset Fixtures Tests
  // =========================================================================

  describe('Dataset Fixtures', () => {
    it('should create a minimal dataset', () => {
      const dataset = createMinimalDataset();

      expect(dataset.users).toHaveLength(1);
      expect(dataset.posts).toHaveLength(1);
      expect(dataset.comments).toHaveLength(1);

      // Verify relationships
      expect(dataset.posts[0].authorId).toBe(dataset.users[0].id);
      expect(dataset.comments[0].postId).toBe(dataset.posts[0].id);
      expect(dataset.comments[0].authorId).toBe(dataset.users[0].id);
    });

    it('should create a demo dataset with proper relationships', () => {
      const dataset = createDemoDataset();

      // Check counts
      expect(dataset.users.length).toBe(3);
      expect(dataset.posts.length).toBeGreaterThan(0);
      expect(dataset.comments.length).toBeGreaterThan(0);

      // Verify all posts have authors
      for (const post of dataset.posts) {
        const author = dataset.users.find((u) => u.id === post.authorId);
        expect(author).toBeDefined();
      }

      // Verify all comments have posts and authors
      for (const comment of dataset.comments) {
        const post = dataset.posts.find((p) => p.id === comment.postId);
        const author = dataset.users.find((u) => u.id === comment.authorId);
        expect(post).toBeDefined();
        expect(author).toBeDefined();
      }
    });

    it('should create a large dataset for pagination testing', () => {
      const dataset = createLargeDataset();

      expect(dataset.users).toHaveLength(5);
      expect(dataset.posts).toHaveLength(20);
      expect(dataset.comments).toHaveLength(60);

      // Verify proper distribution
      const uniquePostAuthors = new Set(dataset.posts.map(p => p.authorId));
      expect(uniquePostAuthors.size).toBeLessThanOrEqual(5);

      // Verify comments are distributed
      const uniqueCommentAuthors = new Set(dataset.comments.map(c => c.authorId));
      expect(uniqueCommentAuthors.size).toBeGreaterThan(1);
    });

    it('should support pagination with large dataset', () => {
      const dataset = createLargeDataset();
      const pageSize = 10;

      const page1 = dataset.posts.slice(0, pageSize);
      const page2 = dataset.posts.slice(pageSize, pageSize * 2);

      expect(page1).toHaveLength(pageSize);
      expect(page2).toHaveLength(pageSize);
      expect(page1[0].id).not.toBe(page2[0].id);
    });
  });

  // =========================================================================
  // Real-World Usage Scenarios
  // =========================================================================

  describe('Real-World Usage Scenarios', () => {
    it('should create a user with their posts and comments (Author View)', () => {
      const user = createUser({
        email: 'author@example.com',
        name: 'Blog Author',
      });

      const userPosts = createPostsBatch(3, { authorId: user.id });
      const userComments = userPosts.flatMap(post =>
        createCommentsBatch(2, {
          postId: post.id,
          authorId: user.id,
        })
      );

      expect(userPosts.every(p => p.authorId === user.id)).toBe(true);
      expect(userComments.every(c => c.authorId === user.id)).toBe(true);
      expect(userComments).toHaveLength(6); // 3 posts * 2 comments
    });

    it('should create a post with its full comment thread', () => {
      const author = createUser({ name: 'Alice' });
      const post = createPost({
        title: 'Interesting Article',
        authorId: author.id,
      });

      const commenters = createUsersBatch(5);
      const comments = commenters.map(commenter =>
        createComment({
          postId: post.id,
          authorId: commenter.id,
        })
      );

      expect(comments).toHaveLength(5);
      expect(comments.every(c => c.postId === post.id)).toBe(true);
      expect(
        new Set(comments.map(c => c.authorId)).size
      ).toBe(5);
    });

    it('should simulate a search result with mixed authors', () => {
      const users = createUsersBatch(3);
      const searchResults = users.flatMap(user =>
        createPostsBatch(2, { authorId: user.id })
      );

      expect(searchResults).toHaveLength(6);
      expect(new Set(searchResults.map(p => p.authorId)).size).toBe(3);
    });

    it('should handle async data flow (simulating API response)', async () => {
      // Simulate fetching user -> posts -> comments
      const user = createUser();

      // Simulate async fetch
      await new Promise(resolve => setTimeout(resolve, 0));

      const posts = createPostsBatch(3, { authorId: user.id });

      await new Promise(resolve => setTimeout(resolve, 0));

      const comments = posts.flatMap(post =>
        createCommentsBatch(2, { postId: post.id, authorId: user.id })
      );

      expect(user).toBeDefined();
      expect(posts).toHaveLength(3);
      expect(comments).toHaveLength(6);
    });
  });

  // =========================================================================
  // Performance & Edge Cases
  // =========================================================================

  describe('Performance & Edge Cases', () => {
    it('should handle creating large datasets efficiently', () => {
      const start = performance.now();
      const dataset = createLargeDataset();
      const end = performance.now();

      const totalItems = dataset.users.length + dataset.posts.length + dataset.comments.length;
      expect(totalItems).toBe(85); // 5 + 20 + 60
      expect(end - start).toBeLessThan(100); // Should be very fast
    });

    it('should create empty batch when count is 0', () => {
      const users = createUsersBatch(0);
      const posts = createPostsBatch(0);
      const comments = createCommentsBatch(0);

      expect(users).toHaveLength(0);
      expect(posts).toHaveLength(0);
      expect(comments).toHaveLength(0);
    });

    it('should handle large batch creation', () => {
      const users = createUsersBatch(100);
      const uniqueIds = new Set(users.map(u => u.id));

      expect(users).toHaveLength(100);
      expect(uniqueIds.size).toBe(100); // All unique
    });

    it('should maintain data immutability', () => {
      const user1 = createUser({ name: 'Original' });
      const user2 = createUser({ name: 'Different' });

      user1.name = 'Modified';

      expect(user2.name).toBe('Different');
    });
  });

  // =========================================================================
  // Integration Examples
  // =========================================================================

  describe('Integration Examples', () => {
    it('example: Use demo data for component test', () => {
      // Simulating component props
      const user = createUser();
      const post = createPost({ authorId: user.id });

      const componentProps = {
        post,
        author: user,
        isLoading: false,
      };

      expect(componentProps.post.authorId).toBe(componentProps.author.id);
    });

    it('example: Use demo data for React Query mock', () => {
      const dataset = createDemoDataset();

      // Simulate React Query cache
      const queryData = {
        users: dataset.users,
        posts: dataset.posts,
        comments: dataset.comments,
      };

      expect(queryData.users.length).toBe(3);
      expect(queryData.posts.every(p =>
        queryData.users.some(u => u.id === p.authorId)
      )).toBe(true);
    });

    it('example: Use demo data for E2E test fixture', () => {
      const dataset = createDemoDataset();

      // Simulate test fixtures
      const fixture = {
        alice: dataset.users[0],
        bob: dataset.users[1],
        posts: dataset.posts.filter(p => p.authorId === dataset.users[0].id),
      };

      expect(fixture.alice).toBeDefined();
      expect(fixture.posts.every(p => p.authorId === fixture.alice.id)).toBe(true);
    });
  });
});

// ============================================================================
// Example Usage Snippets (Not actual tests - for documentation)
// ============================================================================

/**
 * EXAMPLE 1: Using in a component test
 *
 * ```typescript
 * import { render, screen } from '@testing-library/react';
 * import { createUser, createPostsBatch } from '@/lib/demo-data';
 * import UserProfile from '@/components/UserProfile';
 *
 * it('should display user posts', () => {
 *   const user = createUser({ name: 'John Doe' });
 *   const posts = createPostsBatch(3, { authorId: user.id });
 *
 *   render(<UserProfile user={user} posts={posts} />);
 *
 *   expect(screen.getByText('John Doe')).toBeInTheDocument();
 *   expect(screen.getAllByRole('article')).toHaveLength(3);
 * });
 * ```
 */

/**
 * EXAMPLE 2: Using in a hook test with React Query mock
 *
 * ```typescript
 * import { renderHook } from '@testing-library/react';
 * import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
 * import { createDemoDataset } from '@/lib/demo-data';
 * import { usePostsQuery } from '@/hooks/usePostsQuery';
 *
 * it('should fetch and display posts', async () => {
 *   const { posts } = createDemoDataset();
 *   const queryClient = new QueryClient({
 *     defaultOptions: { queries: { retry: false } },
 *   });
 *
 *   queryClient.setQueryData(['posts'], posts);
 *
 *   const { result } = renderHook(() => usePostsQuery(), {
 *     wrapper: ({ children }) => (
 *       <QueryClientProvider client={queryClient}>
 *         {children}
 *       </QueryClientProvider>
 *     ),
 *   });
 *
 *   expect(result.current.data).toEqual(posts);
 * });
 * ```
 */

/**
 * EXAMPLE 3: Using in E2E tests with Playwright
 *
 * ```typescript
 * import { test, expect } from '@playwright/test';
 * import { createDemoDataset } from '@/lib/demo-data';
 *
 * test.describe('Post Feed', () => {
 *   test('should display posts from demo dataset', async ({ page }) => {
 *     const { posts } = createDemoDataset();
 *
 *     await page.goto('/posts');
 *
 *     const postElements = await page.locator('[data-testid="post-card"]').all();
 *     expect(postElements.length).toBeGreaterThan(0);
 *   });
 * });
 * ```
 */

/**
 * EXAMPLE 4: Using in component development (Storybook)
 *
 * ```typescript
 * import type { Meta, StoryObj } from '@storybook/react';
 * import { createUser, createPostsBatch } from '@/lib/demo-data';
 * import UserCard from '@/components/UserCard';
 *
 * const meta: Meta<typeof UserCard> = {
 *   component: UserCard,
 * };
 *
 * export const WithPosts: StoryObj<typeof UserCard> = {
 *   args: {
 *     user: createUser({ name: 'Alice' }),
 *     postCount: 5,
 *   },
 * };
 * ```
 */

