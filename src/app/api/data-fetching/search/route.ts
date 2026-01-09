import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * GET /api/data-fetching/search
 * Search posts by title or content
 *
 * @param request - NextRequest with query parameters: q (search term), limit (max results)
 * @returns Array of matching posts with author information
 * @throws 400 - Missing search query
 * @throws 500 - Database error
 *
 * @example
 * GET /api/data-fetching/search?q=typescript&limit=20
 * Response: { query: "typescript", results: [...], count: 5 }
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q')?.trim();
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));

    // Validate search query
    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required (q parameter)' },
        { status: 400 }
      );
    }

    // Validate limit
    if (isNaN(limit)) {
      return NextResponse.json(
        { error: 'Invalid limit parameter' },
        { status: 400 }
      );
    }

    // Search posts by title or content
    const posts = await db.post.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: limit,
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        comments: {
          select: { id: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      query,
      limit,
      results: posts,
      count: posts.length,
    });
  } catch (error) {
    console.error('GET /api/data-fetching/search error:', error);
    return NextResponse.json(
      { error: 'Failed to search posts' },
      { status: 500 }
    );
  }
}

