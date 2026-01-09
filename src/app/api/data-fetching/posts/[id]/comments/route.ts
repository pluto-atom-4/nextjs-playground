import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * GET /api/data-fetching/posts/[id]/comments
 * Fetch all comments for a specific post
 *
 * @param request - NextRequest object
 * @param params - Route parameters containing post id
 * @returns Array of comments with author information
 * @throws 404 - Post not found
 * @throws 500 - Database error
 *
 * @example
 * GET /api/data-fetching/posts/cuid123/comments
 * Response: [{ id: "...", text: "...", author: {...}, createdAt: "..." }]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Verify post exists
    const post = await db.post.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Fetch comments
    const comments = await db.comment.findMany({
      where: { postId: id },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      postId: id,
      total: comments.length,
      comments,
    });
  } catch (error) {
    console.error(`GET /api/data-fetching/posts/[id]/comments error:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/data-fetching/posts/[id]/comments
 * Create a new comment on a post
 *
 * @param request - NextRequest with JSON body containing text and authorId
 * @param params - Route parameters containing post id
 * @returns Created comment object
 * @throws 400 - Missing required fields
 * @throws 404 - Post or author not found
 * @throws 500 - Database error
 *
 * @example
 * POST /api/data-fetching/posts/cuid123/comments
 * Body: { text: "Great post!", authorId: "userId123" }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { text, authorId } = body;

    // Validate required fields
    if (!text || !authorId) {
      return NextResponse.json(
        { error: 'Missing required fields: text, authorId' },
        { status: 400 }
      );
    }

    // Verify post exists
    const post = await db.post.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
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

    // Create comment
    const comment = await db.comment.create({
      data: {
        text,
        postId: id,
        authorId,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error(`POST /api/data-fetching/posts/[id]/comments error:`, error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}

