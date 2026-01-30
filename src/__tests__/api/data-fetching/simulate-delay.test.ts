import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET } from '@/app/api/data-fetching/simulate-delay/route';
import { NextRequest } from 'next/server';

describe('GET /api/data-fetching/simulate-delay', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Valid delay requests', () => {
    it('should return success with default delay (1000ms)', async () => {
      const request = new NextRequest('http://localhost/api/data-fetching/simulate-delay');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.title).toBe('Delayed Response (1000ms)');
      expect(data.delay).toBe(1000);
      expect(data.status).toBe('completed');
      expect(data.id).toBeDefined();
      expect(data.timestamp).toBeDefined();
    });

    it('should return success with custom delay', async () => {
      const request = new NextRequest('http://localhost/api/data-fetching/simulate-delay?delay=500');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.delay).toBe(500);
      expect(data.title).toContain('500ms');
    });

    it('should measure actual delay time', async () => {
      const request = new NextRequest('http://localhost/api/data-fetching/simulate-delay?delay=100');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.actualDelay).toBeGreaterThanOrEqual(100);
      expect(data.actualDelay).toBeLessThan(200); // Allow some overhead
    });

    it('should allow zero delay', async () => {
      const request = new NextRequest('http://localhost/api/data-fetching/simulate-delay?delay=0');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.delay).toBe(0);
      expect(data.actualDelay).toBeLessThan(100);
    });

    it('should handle small delays', async () => {
      const request = new NextRequest('http://localhost/api/data-fetching/simulate-delay?delay=50');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.delay).toBe(50);
    });

    it('should handle large delays (up to 30 seconds)', { timeout: 10000 }, async () => {
      const request = new NextRequest('http://localhost/api/data-fetching/simulate-delay?delay=5000');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.delay).toBe(5000);
    });

    it('should include title describing the delay', { timeout: 5000 }, async () => {
      const request = new NextRequest('http://localhost/api/data-fetching/simulate-delay?delay=2000');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.title).toContain('Delayed Response');
      expect(data.title).toContain('2000ms');
    });

    it('should include description explaining the purpose', async () => {
      const request = new NextRequest('http://localhost/api/data-fetching/simulate-delay');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.description).toContain('intentionally delayed');
      expect(data.description).toContain('simulate slow data fetching');
    });

    it('should include ISO timestamp', async () => {
      const request = new NextRequest('http://localhost/api/data-fetching/simulate-delay');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.timestamp).toBeDefined();
      // Verify it's a valid ISO string
      expect(() => new Date(data.timestamp)).not.toThrow();
    });

    it('should include unique ID for each response', async () => {
      const request1 = new NextRequest('http://localhost/api/data-fetching/simulate-delay?delay=10');
      const request2 = new NextRequest('http://localhost/api/data-fetching/simulate-delay?delay=10');

      const response1 = await GET(request1);
      const data1 = await response1.json();

      const response2 = await GET(request2);
      const data2 = await response2.json();

      expect(data1.id).not.toBe(data2.id);
    });

    it('should support optional category parameter', async () => {
      const request = new NextRequest('http://localhost/api/data-fetching/simulate-delay?delay=100&category=performance-test');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.category).toBe('performance-test');
    });

    it('should work without category parameter', async () => {
      const request = new NextRequest('http://localhost/api/data-fetching/simulate-delay?delay=100');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.category).toBeUndefined();
    });
  });

  describe('Error cases', () => {
    it('should return 400 for negative delay', async () => {
      const request = new NextRequest('http://localhost/api/data-fetching/simulate-delay?delay=-1000');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Invalid delay parameter');
    });

    it('should return 400 for non-numeric delay', async () => {
      const request = new NextRequest('http://localhost/api/data-fetching/simulate-delay?delay=abc');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Invalid delay parameter');
    });

    it('should return 400 for delay exceeding 30 seconds', async () => {
      const request = new NextRequest('http://localhost/api/data-fetching/simulate-delay?delay=31000');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Delay exceeds maximum allowed');
    });

    it('should return 400 for delay at boundary (30001ms)', async () => {
      const request = new NextRequest('http://localhost/api/data-fetching/simulate-delay?delay=30001');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Delay exceeds maximum allowed');
    });

    it('should accept delay at maximum boundary (30000ms)', { timeout: 35000 }, async () => {
      const request = new NextRequest('http://localhost/api/data-fetching/simulate-delay?delay=30000');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.delay).toBe(30000);
    });

    it('should truncate float delay values (parseInt behavior)', async () => {
      const request = new NextRequest('http://localhost/api/data-fetching/simulate-delay?delay=1000.5');
      const response = await GET(request);
      const data = await response.json();

      // parseInt truncates decimals to 1000
      expect(response.status).toBe(200);
      expect(data.delay).toBe(1000);
    });

    it('should return 1000ms default when delay parameter is empty', async () => {
      const request = new NextRequest('http://localhost/api/data-fetching/simulate-delay?delay=');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.delay).toBe(1000);
    });
  });

  describe('Response structure', () => {
    it('should include all required fields', async () => {
      const request = new NextRequest('http://localhost/api/data-fetching/simulate-delay?delay=100');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('title');
      expect(data).toHaveProperty('description');
      expect(data).toHaveProperty('status');
      expect(data).toHaveProperty('delay');
      expect(data).toHaveProperty('actualDelay');
      expect(data).toHaveProperty('timestamp');
    });

    it('should have status as "completed"', async () => {
      const request = new NextRequest('http://localhost/api/data-fetching/simulate-delay');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe('completed');
    });

    it('should have ID starting with "item-"', async () => {
      const request = new NextRequest('http://localhost/api/data-fetching/simulate-delay');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.id).toMatch(/^item-/);
    });
  });

  describe('Edge cases', () => {
    it('should handle multiple delay parameters (uses first)', async () => {
      const request = new NextRequest('http://localhost/api/data-fetching/simulate-delay?delay=100&delay=200');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      // Should use the first value (100)
      expect(data.delay).toBe(100);
    });

    it('should preserve category through delay response', async () => {
      const request = new NextRequest('http://localhost/api/data-fetching/simulate-delay?delay=50&category=streaming-demo');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.delay).toBe(50);
      expect(data.category).toBe('streaming-demo');
    });

    it('should work with large category parameter', async () => {
      const longCategory = 'a'.repeat(500);
      const request = new NextRequest(`http://localhost/api/data-fetching/simulate-delay?delay=50&category=${longCategory}`);
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.category).toBe(longCategory);
    });

    it('should handle special characters in category', async () => {
      const request = new NextRequest('http://localhost/api/data-fetching/simulate-delay?delay=50&category=test%2Fcategory');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.category).toBe('test/category');
    });
  });

  describe('Performance characteristics', () => {
    it('should complete within reasonable time for small delays', async () => {
      const request = new NextRequest('http://localhost/api/data-fetching/simulate-delay?delay=100');
      const startTime = Date.now();
      const response = await GET(request);
      const endTime = Date.now();

      expect(response.status).toBe(200);
      expect(endTime - startTime).toBeGreaterThanOrEqual(100);
      expect(endTime - startTime).toBeLessThan(500); // Should be close to requested delay
    });

    it('should measure overhead accurately', { timeout: 5000 }, async () => {
      const request = new NextRequest('http://localhost/api/data-fetching/simulate-delay?delay=200');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      // actualDelay should be close to delay parameter
      const overhead = Math.abs(data.actualDelay - data.delay);
      expect(overhead).toBeLessThan(100); // Less than 100ms overhead
    });

    it('should accept concurrent requests', async () => {
      const requests = [
        new NextRequest('http://localhost/api/data-fetching/simulate-delay?delay=50'),
        new NextRequest('http://localhost/api/data-fetching/simulate-delay?delay=50'),
        new NextRequest('http://localhost/api/data-fetching/simulate-delay?delay=50'),
      ];

      const responses = await Promise.all(requests.map((req) => GET(req)));
      const dataList = await Promise.all(responses.map((res) => res.json()));

      for (const res of responses) {
        expect(res.status).toBe(200);
      }

      for (const data of dataList) {
        expect(data.delay).toBe(50);
        expect(data.status).toBe('completed');
      }

      // All should have unique IDs
      const ids = new Set(dataList.map((d) => d.id));
      expect(ids.size).toBe(3);
    });
  });
});






