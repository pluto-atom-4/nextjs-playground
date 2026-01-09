import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Simple in-memory metrics tracker
interface RequestMetrics {
  timestamp: number;
  path: string;
  method: string;
  duration: number;
  status: number;
}

const metricsBuffer: RequestMetrics[] = [];
const MAX_METRICS = 1000;

/**
 * Track request metrics
 * @internal
 */
export function trackMetric(
  path: string,
  method: string,
  duration: number,
  status: number
) {
  metricsBuffer.push({
    timestamp: Date.now(),
    path,
    method,
    duration,
    status,
  });

  // Keep buffer from growing too large
  if (metricsBuffer.length > MAX_METRICS) {
    metricsBuffer.shift();
  }
}

/**
 * GET /api/data-fetching/metrics
 * Get cache and performance metrics
 *
 * @returns Metrics object with cache stats, response times, and database info
 * @throws 500 - Database error
 *
 * @example
 * GET /api/data-fetching/metrics
 * Response: {
 *   database: { posts: 50, users: 10, comments: 200 },
 *   performance: { avgResponseTime: 45, p95: 120, slowestRoute: "..." },
 *   cache: { cacheHits: 150, cacheMisses: 45 },
 *   recentRequests: [...]
 * }
 */
export async function GET() {
  try {
    const startTime = performance.now();

    // Get database statistics
    const [postCount, userCount, commentCount] = await Promise.all([
      db.post.count(),
      db.user.count(),
      db.comment.count(),
    ]);

    // Calculate performance metrics
    const responseTimes = metricsBuffer.map((m) => m.duration);
    const avgResponseTime = responseTimes.length
      ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
      : 0;

    const sortedTimes = [...responseTimes].sort((a, b) => a - b);
    const p95Index = Math.floor(sortedTimes.length * 0.95);
    const p95ResponseTime = sortedTimes[p95Index] || 0;

    // Get slowest route
    const slowestRequest = metricsBuffer.reduce((prev, current) => {
      return current.duration > prev.duration ? current : prev;
    }, metricsBuffer[0] || { duration: 0 });

    // Count cache hits (200/304 responses) vs misses
    const cacheHits = metricsBuffer.filter(
      (m) => m.status === 200 || m.status === 304
    ).length;
    const cacheMisses = metricsBuffer.filter((m) => m.status === 404 || m.status === 500).length;

    // Get recent requests (last 10)
    const recentRequests = metricsBuffer.slice(-10).map((m) => ({
      method: m.method,
      path: m.path,
      duration: m.duration,
      status: m.status,
      timestamp: new Date(m.timestamp).toISOString(),
    }));

    const queryTime = performance.now() - startTime;

    return NextResponse.json({
      database: {
        posts: postCount,
        users: userCount,
        comments: commentCount,
      },
      performance: {
        avgResponseTime,
        p95ResponseTime,
        slowestRoute: slowestRequest.path || 'N/A',
        slowestRouteDuration: slowestRequest.duration,
      },
      cache: {
        cacheHits,
        cacheMisses,
        hitRate: metricsBuffer.length
          ? Math.round((cacheHits / metricsBuffer.length) * 100)
          : 0,
      },
      recent: {
        totalRequests: metricsBuffer.length,
        recentRequests,
      },
      queryTime,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('GET /api/data-fetching/metrics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}

