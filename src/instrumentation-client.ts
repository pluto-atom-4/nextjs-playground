import { useEffect } from 'react';

/**
 * Client-side instrumentation for analytics and monitoring
 * This file is loaded by Next.js automatically on the client side
 *
 * Reference: https://nextjs.org/docs/app/guides/analytics
 */

export function register() {
  if (typeof window === 'undefined') {
    return;
  }

  // Example: Web Vitals tracking
  if ('web-vital' in window) {
    const vitals = (window as any)['web-vital'];

    // Track Core Web Vitals
    vitals.onCLS((metric: any) => {
      console.log('CLS:', metric);
      // Send to your analytics service
      // Example: analytics.track('CLS', { value: metric.value });
    });

    vitals.onFID((metric: any) => {
      console.log('FID:', metric);
      // Send to your analytics service
    });

    vitals.onFCP((metric: any) => {
      console.log('FCP:', metric);
      // Send to your analytics service
    });

    vitals.onLCP((metric: any) => {
      console.log('LCP:', metric);
      // Send to your analytics service
    });

    vitals.onTTFB((metric: any) => {
      console.log('TTFB:', metric);
      // Send to your analytics service
    });
  }

  // Example: Custom analytics tracking
  // Uncomment and customize for your analytics provider
  /*
  const handleRouteChange = (url: string) => {
    console.log('Route changed to:', url);
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
      console.log('Page hidden');
    } else {
      console.log('Page visible');
    }
  });
  */
}

/**
 * Optional: Hook for tracking analytics in components
 * Usage: useAnalytics('event-name', { custom: 'data' })
 */
export function useAnalytics(eventName: string, data?: Record<string, any>) {
  useEffect(() => {
    // Send analytics event
    console.log(`Analytics Event: ${eventName}`, data);

    // Example integration with analytics service:
    // analytics.track(eventName, data);
  }, [eventName, data]);
}

