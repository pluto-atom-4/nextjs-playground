/**
 * Mock Data Factories for Testing & Development
 *
 * Provides lightweight, reusable factories to generate demo data
 * without requiring database seeding. Useful for:
 * - Unit tests with isolated data
 * - Component development without live database
 * - E2E test fixtures
 * - Storybook demonstrations
 *
 * Usage:
 *   const user = createUser({ name: 'John' });
 *   const posts = createPostsBatch(5, { authorId: user.id });
 *   const comments = createCommentsBatch(3, { postId: posts[0].id });
 */

import type { User, Post, Comment } from '@/generated/prisma/client';

// ============================================================================
// Utilities
// ============================================================================

/**
 * Generate a random CUID-like identifier (not cryptographically secure,
 * but sufficient for demo/test data).
 *
 * @returns Generated ID string with 'c' prefix and 10 random characters
 */
function generateId(): string {
  return `c${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Generate a timestamp offset from now.
 *
 * @param secondsOffset - Number of seconds to offset (negative for past, positive for future). Default: 0
 * @returns Date object with the offset applied
 */
function getTimestamp(secondsOffset = 0): Date {
  const date = new Date();
  date.setSeconds(date.getSeconds() + secondsOffset);
  return date;
}

// ============================================================================
// User Factory
// ============================================================================

export interface CreateUserInput {
  id?: string;
  email?: string;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Creates a mock User object with randomized defaults.
 *
 * @param overrides - Partial user properties to override defaults
 * @returns Complete User object with all required fields
 *
 * @example
 * const user = createUser({ name: 'Alice' });
 * const users = Array.from({ length: 5 }, (_, i) =>
 *   createUser({ email: `user${i}@example.com` })
 * );
 */
export function createUser(overrides: CreateUserInput = {}): User {
  const id = overrides.id ?? generateId();
  const index = Math.floor(Math.random() * 1000);

  return {
    id,
    email: overrides.email ?? `user${index}@example.com`,
    name: overrides.name ?? `User ${index}`,
    createdAt: overrides.createdAt ?? getTimestamp(-3600),
    updatedAt: overrides.updatedAt ?? getTimestamp(-1800),
  };
}

/**
 * Creates multiple mock Users with optional shared overrides.
 *
 * @param count - Number of users to generate
 * @param overrides - Partial properties to apply to all users
 * @returns Array of unique User objects
 *
 * @example
 * const users = createUsersBatch(10);
 * const customUsers = createUsersBatch(3, { name: 'Custom User' });
 */
export function createUsersBatch(count: number, overrides: CreateUserInput = {}): User[] {
  return Array.from({ length: count }, (_, i) =>
    createUser({
      ...overrides,
      email: overrides.email ?? `user${i + 1}@example.com`,
      name: overrides.name ?? `User ${i + 1}`,
    })
  );
}

// ============================================================================
// Post Factory
// ============================================================================

export interface CreatePostInput {
  id?: string;
  title?: string;
  content?: string;
  authorId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Creates a mock Post object with randomized content.
 *
 * @param overrides - Partial post properties to override defaults
 * @returns Complete Post object with all required fields
 *
 * @example
 * const post = createPost({ title: 'My First Post', authorId: user.id });
 * const posts = Array.from({ length: 5 }, (_, i) =>
 *   createPost({ authorId: user.id })
 * );
 */
export function createPost(overrides: CreatePostInput = {}): Post {
  const id = overrides.id ?? generateId();
  const index = Math.floor(Math.random() * 1000);

  return {
    id,
    title: overrides.title ?? `Post Title ${index}`,
    content: overrides.content ??
      `This is a sample post content. ${index}\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
    authorId: overrides.authorId ?? generateId(),
    createdAt: overrides.createdAt ?? getTimestamp(-7200),
    updatedAt: overrides.updatedAt ?? getTimestamp(-3600),
  };
}

/**
 * Creates multiple mock Posts with sequential timestamps.
 *
 * @param count - Number of posts to generate
 * @param overrides - Partial properties to apply to all posts
 * @returns Array of Post objects
 *
 * @example
 * const posts = createPostsBatch(5, { authorId: user.id });
 * const recentPosts = createPostsBatch(3, {
 *   authorId: user.id,
 *   createdAt: new Date()
 * });
 */
export function createPostsBatch(count: number, overrides: CreatePostInput = {}): Post[] {
  return Array.from({ length: count }, (_, i) =>
    createPost({
      ...overrides,
      title: overrides.title ?? `Post ${i + 1}: ${['Next.js Tips', 'React Patterns', 'TypeScript Guide', 'Performance Tips', 'Best Practices'][i % 5]}`,
      createdAt: overrides.createdAt ?? getTimestamp(-7200 - i * 1800),
    })
  );
}

// ============================================================================
// Comment Factory
// ============================================================================

export interface CreateCommentInput {
  id?: string;
  text?: string;
  postId?: string;
  authorId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Creates a mock Comment object with randomized text.
 *
 * @param overrides - Partial comment properties to override defaults
 * @returns Complete Comment object with all required fields
 *
 * @example
 * const comment = createComment({
 *   text: 'Great post!',
 *   postId: post.id,
 *   authorId: user.id
 * });
 */
export function createComment(overrides: CreateCommentInput = {}): Comment {
  const id = overrides.id ?? generateId();
  const index = Math.floor(Math.random() * 1000);
  const sampleTexts = [
    'Great post! Very helpful.',
    'Thanks for sharing this.',
    'This is exactly what I needed.',
    'Well explained and easy to follow.',
    'I learned something new here.',
    'Excellent explanation!',
    'This saved me hours of work.',
    'Totally agree with this approach.',
  ];

  return {
    id,
    text: overrides.text ?? sampleTexts[index % sampleTexts.length],
    postId: overrides.postId ?? generateId(),
    authorId: overrides.authorId ?? generateId(),
    createdAt: overrides.createdAt ?? getTimestamp(-3600),
    updatedAt: overrides.updatedAt ?? getTimestamp(-1800),
  };
}

/**
 * Creates multiple mock Comments with varied text.
 *
 * @param count - Number of comments to generate
 * @param overrides - Partial properties to apply to all comments
 * @returns Array of Comment objects
 *
 * @example
 * const comments = createCommentsBatch(5, { postId: post.id });
 * const userComments = createCommentsBatch(3, {
 *   authorId: user.id,
 *   postId: post.id
 * });
 */
export function createCommentsBatch(count: number, overrides: CreateCommentInput = {}): Comment[] {
  const sampleTexts = [
    'Great post! Very helpful.',
    'Thanks for sharing this.',
    'This is exactly what I needed.',
    'Well explained and easy to follow.',
    'I learned something new here.',
    'Excellent explanation!',
    'This saved me hours of work.',
    'Totally agree with this approach.',
  ];

  return Array.from({ length: count }, (_, i) =>
    createComment({
      ...overrides,
      text: overrides.text ?? sampleTexts[i % sampleTexts.length],
      createdAt: overrides.createdAt ?? getTimestamp(-3600 - i * 600),
    })
  );
}

// ============================================================================
// Fixture Sets - Complete Demo Datasets
// ============================================================================

export interface DemoDataset {
  users: User[];
  posts: Post[];
  comments: Comment[];
}

/**
 * Creates a complete demo dataset with related users, posts, and comments.
 *
 * Generates a realistic structure with proper relationships:
 * - 3 users (Alice, Bob, Charlie)
 * - 5 posts (3 from Alice, 2 from Bob)
 * - 7 comments distributed across posts
 *
 * @returns Complete dataset with relationships properly configured
 *
 * @example
 * const { users, posts, comments } = createDemoDataset();
 *
 * // Use in tests
 * const [alice] = users;
 * const [alicePosts] = posts.filter(p => p.authorId === alice.id);
 * const postComments = comments.filter(c => c.postId === alicePosts.id);
 */
export function createDemoDataset(): DemoDataset {
  // Create users
  const users = [
    createUser({ email: 'alice@example.com', name: 'Alice Johnson' }),
    createUser({ email: 'bob@example.com', name: 'Bob Smith' }),
    createUser({ email: 'charlie@example.com', name: 'Charlie Brown' }),
  ];

  // Create posts by users
  const posts = [
    // Alice's posts
    createPost({
      title: 'Getting Started with Next.js',
      content: 'Next.js is a powerful framework for building React applications. It provides an excellent developer experience with features like file-based routing, automatic code splitting, and built-in API routes.',
      authorId: users[0].id,
    }),
    createPost({
      title: 'Understanding Server Components',
      content: 'Server Components are a new paradigm in React that allow you to write async components directly in React. They execute exclusively on the server and can securely access backend resources.',
      authorId: users[0].id,
    }),
    createPost({
      title: 'React Query Best Practices',
      content: 'React Query is a powerful library for managing server state in your React application. Learn the best practices for structuring queries, mutations, and caching strategies.',
      authorId: users[0].id,
    }),
    // Bob's posts
    createPost({
      title: 'TypeScript Advanced Patterns',
      content: 'Master advanced TypeScript patterns including utility types, conditional types, and generic constraints to write more robust and maintainable code.',
      authorId: users[1].id,
    }),
    createPost({
      title: 'Performance Optimization Tips',
      content: 'Discover practical techniques to optimize your Next.js applications for performance, including image optimization, code splitting, and caching strategies.',
      authorId: users[1].id,
    }),
  ];

  // Create comments on posts
  const comments = [
    // Comments on Alice's first post
    createComment({
      text: 'Great introduction to Next.js! Very clear explanation.',
      postId: posts[0].id,
      authorId: users[1].id,
    }),
    createComment({
      text: 'This helped me get started with my first Next.js project.',
      postId: posts[0].id,
      authorId: users[2].id,
    }),
    // Comments on Alice's second post
    createComment({
      text: 'Server Components are game-changing! Great breakdown.',
      postId: posts[1].id,
      authorId: users[1].id,
    }),
    // Comments on Alice's third post
    createComment({
      text: 'React Query simplified my data fetching so much.',
      postId: posts[2].id,
      authorId: users[2].id,
    }),
    createComment({
      text: 'The caching strategies explained here are exactly what we needed.',
      postId: posts[2].id,
      authorId: users[1].id,
    }),
    // Comments on Bob's first post
    createComment({
      text: 'Advanced TypeScript patterns explained perfectly!',
      postId: posts[3].id,
      authorId: users[0].id,
    }),
    createComment({
      text: 'Utility types are so powerful. Thanks for the examples.',
      postId: posts[3].id,
      authorId: users[2].id,
    }),
  ];

  return { users, posts, comments };
}

/**
 * Creates a minimal demo dataset for quick testing.
 *
 * Generates:
 * - 1 user
 * - 1 post
 * - 1 comment
 *
 * @returns Minimal dataset with basic relationships
 *
 * @example
 * const { users, posts, comments } = createMinimalDataset();
 * const [user] = users;
 * const [post] = posts;
 * const [comment] = comments;
 */
export function createMinimalDataset(): DemoDataset {
  const users = [createUser({ email: 'test@example.com', name: 'Test User' })];
  const posts = [
    createPost({
      title: 'Test Post',
      content: 'This is a test post for demonstration.',
      authorId: users[0].id,
    }),
  ];
  const comments = [
    createComment({
      text: 'Test comment',
      postId: posts[0].id,
      authorId: users[0].id,
    }),
  ];

  return { users, posts, comments };
}

/**
 * Creates a large demo dataset for pagination and performance testing.
 *
 * Generates:
 * - 5 users
 * - 20 posts distributed across users
 * - 60 comments distributed across posts
 *
 * @returns Large dataset suitable for testing pagination and performance
 *
 * @example
 * const { users, posts, comments } = createLargeDataset();
 * const page1 = posts.slice(0, 10);
 * const page2 = posts.slice(10, 20);
 */
export function createLargeDataset(): DemoDataset {
  const users = createUsersBatch(5);

  // Distribute 20 posts across users
  const posts = Array.from({ length: 20 }, (_, i) =>
    createPost({
      title: `Post ${i + 1}: ${['Tips', 'Guide', 'Tutorial', 'Best Practices', 'Deep Dive'][i % 5]}`,
      content: `This is post number ${i + 1}. It contains helpful information about web development, React, Next.js, and TypeScript.`,
      authorId: users[i % users.length].id,
      createdAt: getTimestamp(-86400 - i * 3600), // Spread over multiple days
    })
  );

  // Create 60 comments distributed across posts
  const comments = Array.from({ length: 60 }, (_, i) =>
    createComment({
      text: ['Great post!', 'Very helpful.', 'Thanks for sharing.', 'Exactly what I needed.', 'Excellent explanation!'][i % 5],
      postId: posts[i % posts.length].id,
      authorId: users[(i + 1) % users.length].id,
      createdAt: getTimestamp(-3600 - i * 300),
    })
  );

  return { users, posts, comments };
}

// ============================================================================
// Type Exports for Testing
// ============================================================================

/**
 * Type-safe helper to ensure demo data has required properties
 * Useful for component prop validation
 */
export type UserWithPosts = User & { posts?: Post[] };
export type PostWithAuthor = Post & { author?: User };
export type CommentWithAuthor = Comment & { author?: User };
export type CommentWithPost = Comment & { post?: Post };

/**
 * Re-export Prisma types for convenience
 */
export type { User, Post, Comment } from '@/generated/prisma/client';

