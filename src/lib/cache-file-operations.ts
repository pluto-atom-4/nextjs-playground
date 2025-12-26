// File-level cache utilities demonstrating 'use cache' concept
// In Next.js 16 Server Components, 'use cache' at the top of a file
// enables automatic caching for all exported functions

interface CacheMetrics {
  hits: number;
  misses: number;
  lastUpdated: string;
}

let cacheMetrics: CacheMetrics = {
  hits: 0,
  misses: 0,
  lastUpdated: new Date().toISOString(),
};

// Simulate an expensive database query with 'use cache'
export async function getExpensiveData() {
  console.log('[FILE-CACHE] Fetching expensive data...');

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  cacheMetrics.misses++;
  cacheMetrics.lastUpdated = new Date().toISOString();

  return {
    data: [
      { id: 1, name: 'Database Query Result 1', timestamp: new Date().toISOString() },
      { id: 2, name: 'Database Query Result 2', timestamp: new Date().toISOString() },
      { id: 3, name: 'Database Query Result 3', timestamp: new Date().toISOString() },
    ],
  };
}

// Simulate an API call
export async function fetchUserProfile(userId: string) {
  console.log(`[FILE-CACHE] Fetching profile for user: ${userId}`);

  await new Promise((resolve) => setTimeout(resolve, 800));

  cacheMetrics.hits++;
  cacheMetrics.lastUpdated = new Date().toISOString();

  return {
    id: userId,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Developer',
    joinedAt: new Date().toISOString(),
  };
}

// Get current cache metrics
export function getCacheMetrics() {
  return cacheMetrics;
}

// Reset metrics
export function resetCacheMetrics() {
  cacheMetrics = {
    hits: 0,
    misses: 0,
    lastUpdated: new Date().toISOString(),
  };
}

