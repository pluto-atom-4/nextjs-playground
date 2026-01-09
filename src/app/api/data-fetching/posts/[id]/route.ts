import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * GET /api/data-fetching/posts/[id]
 * Fetch a single post with its comments
 *
 * @param request - NextRequest object
 * @param params - Route parameters containing post id
 * @returns Post object with author and comments
 * @throws 404 - Post not found
 * @throws 500 - Database error
 *
 * @example
 * GET /api/data-fetching/posts/cuid123
 * Response: { id: "...", title: "...", content: "...", author: {...}, comments: [...] }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const post = await db.post.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        comments: {
          include: {
            author: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error(`GET /api/data-fetching/posts/[id] error:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/data-fetching/posts/[id]
 * Update a post
 *
 * @param request - NextRequest with JSON body containing title and/or content
 * @param params - Route parameters containing post id
 * @returns Updated post object
 * @throws 400 - No fields to update
 * @throws 404 - Post not found
 * @throws 500 - Database error
 *
 * @example
 * PUT /api/data-fetching/posts/cuid123
 * Body: { title: "Updated title", content: "Updated content" }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { title, content } = body;

    // Validate that at least one field is provided
    if (!title && !content) {
      return NextResponse.json(
        { error: 'At least one field (title or content) is required' },
        { status: 400 }
      );
    }

    // Check if post exists
    const existingPost = await db.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Update post
    const updatedPost = await db.post.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error(`PUT /api/data-fetching/posts/[id] error:`, error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/data-fetching/posts/[id]
 * Delete a post
 *
 * @param request - NextRequest object
 * @param params - Route parameters containing post id
 * @returns Success message with deleted post id
 * @throws 404 - Post not found
 * @throws 500 - Database error
 *
 * @example
 * DELETE /api/data-fetching/posts/cuid123
 * Response: { message: "Post deleted", id: "cuid123" }
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if post exists
    const existingPost = await db.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Delete post (comments cascade delete via Prisma schema)
    await db.post.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Post deleted', id },
      { status: 200 }
    );
  } catch (error) {
    console.error(`DELETE /api/data-fetching/posts/[id] error:`, error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}

