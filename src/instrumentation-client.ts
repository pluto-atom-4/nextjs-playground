import { useEffect } from 'react';
import { createLogger } from './lib/logger';

/**
 * Client-side instrumentation for analytics and monitoring
 * This file is loaded by Next.js automatically on the client side
 *
 * Reference: https://nextjs.org/docs/app/guides/analytics
 */

const logger = createLogger({ prefix: 'VITALS', timestamp: true });

export function register() {
  if (typeof window === 'undefined') {
    return;
  }

  // Example: Web Vitals tracking
  if ('web-vital' in window) {
    const vitals = (window as any)['web-vital'];

    // Track Core Web Vitals
    vitals.onCLS((metric: any) => {
      logger.debug('CLS metric', metric);
      // Send to your analytics service
      // Example: analytics.track('CLS', { value: metric.value });
    });

    vitals.onFID((metric: any) => {
      logger.debug('FID metric', metric);
      // Send to your analytics service
    });

    vitals.onFCP((metric: any) => {
      logger.debug('FCP metric', metric);
      // Send to your analytics service
    });

    vitals.onLCP((metric: any) => {
      logger.debug('LCP metric', metric);
      // Send to your analytics service
    });

    vitals.onTTFB((metric: any) => {
      logger.debug('TTFB metric', metric);
      // Send to your analytics service
    });
  }

  // Example: Custom analytics tracking
  // Uncomment and customize for your analytics provider
  /*
  const handleRouteChange = (url: string) => {
    logger.debug('Route changed', { url });
    // Send page view to your analytics service
    // analytics.pageview(url);
  };

  if (window.location) {
    // Track initial page load
    handleRouteChange(window.location.pathname);
  }
  */

  // Example: Track page visibility
  /*
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      logger.info('Page hidden');
    } else {
      logger.info('Page visible');
    }
  });
  */
}

/**
 * Optional: Hook for tracking analytics in components
 * Usage: useAnalytics('event-name', { custom: 'data' })
 */
export function useAnalytics(eventName: string, data?: Record<string, unknown>) {
  useEffect(() => {
    // Log analytics event
    logger.debug(`Analytics Event: ${eventName}`, data);

    // Example integration with analytics service:
    // analytics.track(eventName, data);
  }, [eventName, data]);
}

