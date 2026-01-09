import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/data-fetching/simulate-delay
 * Simulate a slow endpoint with optional delay
 *
 * Used to test streaming patterns, loading states, and timeouts
 *
 * @param request - NextRequest with query parameters: delay (milliseconds)
 * @returns JSON response with timing information
 * @throws 400 - Invalid delay parameter
 * @throws 408 - Request timeout (if delay > 30000ms)
 *
 * @example
 * GET /api/data-fetching/simulate-delay?delay=3000
 * Response: { message: "Delayed response", delay: 3000, timestamp: "2025-01-08T..." }
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const delayParam = searchParams.get('delay');

    // Parse delay with default of 1000ms
    let delay = 1000;
    if (delayParam) {
      delay = parseInt(delayParam);

      // Validate delay parameter
      if (isNaN(delay) || delay < 0) {
        return NextResponse.json(
          { error: 'Invalid delay parameter. Must be a non-negative number.' },
          { status: 400 }
        );
      }

      // Prevent excessively long delays (max 30 seconds)
      if (delay > 30000) {
        return NextResponse.json(
          { error: 'Delay exceeds maximum allowed (30000ms)' },
          { status: 400 }
        );
      }
    }

    // Simulate the delay
    const startTime = Date.now();
    await new Promise((resolve) => setTimeout(resolve, delay));
    const actualDelay = Date.now() - startTime;

    // Generate mock data
    const mockData = {
      id: `item-${Math.random().toString(36).substr(2, 9)}`,
      title: `Delayed Response (${delay}ms)`,
      description: `This response was intentionally delayed to simulate slow data fetching`,
      status: 'completed',
      delay,
      actualDelay,
      timestamp: new Date().toISOString(),
    };

    // Optional: include category from query param
    const category = searchParams.get('category');
    if (category) {
      Object.assign(mockData, { category });
    }

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('GET /api/data-fetching/simulate-delay error:', error);
    return NextResponse.json(
      { error: 'Failed to process delayed request' },
      { status: 500 }
    );
  }
}

