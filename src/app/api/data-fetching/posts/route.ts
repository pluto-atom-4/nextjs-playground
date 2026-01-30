import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * GET /api/data-fetching/posts
 * Fetch all posts with optional pagination
 *
 * @param request - NextRequest object
 * @returns JSON array of posts with pagination info
 * @throws 400 - Invalid pagination parameters
 * @throws 500 - Database error
 *
 * @example
 * GET /api/data-fetching/posts?page=1&limit=10
 * Response: { posts: [...], total: 50, page: 1, limit: 10, pages: 5 }
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, Number.parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, Number.parseInt(searchParams.get('limit') || '10')));

    // Validate pagination parameters
    if (Number.isNaN(page) || Number.isNaN(limit)) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    // Fetch total count and paginated posts
    const [total, posts] = await Promise.all([
      db.post.count(),
      db.post.findMany({
        skip,
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
      }),
    ]);

    const pages = Math.ceil(total / limit);

    return NextResponse.json({
      posts,
      pagination: {
        total,
        page,
        limit,
        pages,
      },
    });
  } catch (error) {
    console.error('GET /api/data-fetching/posts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/data-fetching/posts
 * Create a new post
 *
 * @param request - NextRequest with JSON body containing title, content, authorId
 * @returns Created post object
 * @throws 400 - Missing required fields
 * @throws 404 - Author not found
 * @throws 500 - Database error
 *
 * @example
 * POST /api/data-fetching/posts
 * Body: { title: "...", content: "...", authorId: "..." }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, authorId } = body;

    // Validate required fields
    if (!title || !content || !authorId) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, authorId' },
        { status: 400 }
      );
    }

    // Verify author exists
    const author = await db.user.findUnique({
      where: { id: authorId },
    });

    if (!author) {
      return NextResponse.json(
        { error: 'Author not found' },
        { status: 404 }
      );
    }

    // Create post
    const post = await db.post.create({
      data: {
        title,
        content,
        authorId,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('POST /api/data-fetching/posts error:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

