'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import styles from './cache-showcase.module.css';

export default function CacheShowcase() {
  const { resolvedTheme } = useTheme();
  const [selectedExample, setSelectedExample] = useState<string | null>(null);

  const examples = [
    {
      id: 'file-level',
      title: 'File-Level Cache',
      description: 'Learn how to cache entire file-level functions with "use cache" directive',
      route: '/cache-showcase/file-level',
      details:
        'Use "use cache" at the top of a file to cache all expensive operations throughout that file. Perfect for database queries, API calls, or heavy computations.',
    },
    {
      id: 'page-level',
      title: 'Page-Level Cache',
      description: 'Demonstrate caching at the page component level',
      route: '/cache-showcase/page-level',
      details:
        'Cache specific page data to improve load times and reduce server load. Each page can have its own caching strategy.',
    },
    {
      id: 'function-level',
      title: 'Function-Level Cache',
      description: 'Show granular control with function-level caching',
      route: '/cache-showcase/function-level',
      details:
        'Cache individual functions for fine-grained control. Useful when you need to cache only specific operations within a component or utility.',
    },
  ];

  return (
    <div className={`${styles.container} ${resolvedTheme === 'dark' ? 'dark' : 'light'}`}>
      <div className={styles.contentWrapper}>
        {/* Header */}
        <div className={styles.headerContainer}>
          <h1 className={styles.headerMainTitle}>
            Next.js 16 Cache Showcase
          </h1>
          <p style={{fontSize: '1.25rem', color: 'rgb(75, 85, 99)', marginBottom: '0.5rem'}}>
            Explore the power of <code className={styles.codeInline}>'use cache'</code> directive
          </p>
          <p className={styles.headerDescription}>
            Master caching strategies for optimal performance with React 19.2
          </p>
        </div>

        {/* Examples Grid */}
        <div className={styles.examplesGrid}>
          {examples.map((example) => (
            <div
              key={example.id}
              onClick={() => setSelectedExample(example.id)}
              className={styles.exampleCard}
            >
              <h2 className={styles.exampleTitle}>
                {example.title}
              </h2>
              <p className={styles.exampleDescription}>{example.description}</p>
              <Link
                href={example.route}
                className={styles.exploreLink}
              >
                Explore →
              </Link>
            </div>
          ))}
        </div>

        {/* Detailed View */}
        {selectedExample && (
          <div className={styles.detailSection}>
            <div className={styles.detailHeader}>
              <h3 className={styles.detailTitle}>
                {examples.find((e) => e.id === selectedExample)?.title}
              </h3>
              <button
                onClick={() => setSelectedExample(null)}
                className={styles.closeButton}
              >
                ✕
              </button>
            </div>
            <p className={styles.detailContent}>
              {examples.find((e) => e.id === selectedExample)?.details}
            </p>
          </div>
        )}

        {/* Features Section */}
        <div className={styles.featuresSection}>
          <h2 className={styles.featureSectionTitle}>
            Key Caching Features
          </h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureItem}>
              <div>
                <h3 className={styles.featureItemTitle}>
                  ⚡ Performance Improvement
                </h3>
                <p className={styles.featureItemDescription}>
                  Reduce server load and improve response times by caching expensive operations.
                </p>
              </div>
            </div>
            <div className={styles.featureItem}>
              <div>
                <h3 className={styles.featureItemTitle}>
                  🎯 Granular Control
                </h3>
                <p className={styles.featureItemDescription}>
                  Choose where and how to cache: at file, page, or function level.
                </p>
              </div>
            </div>
            <div className={styles.featureItem}>
              <div>
                <h3 className={styles.featureItemTitle}>
                  🔄 Revalidation Strategies
                </h3>
                <p className={styles.featureItemDescription}>
                  Control cache lifetime with time-based or on-demand revalidation.
                </p>
              </div>
            </div>
            <div className={styles.featureItem}>
              <div>
                <h3 className={styles.featureItemTitle}>
                  📊 Real-time Monitoring
                </h3>
                <p className={styles.featureItemDescription}>
                  Track cache hits and misses to understand your caching behavior.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className={styles.backLinkSection}>
          <Link
            href="/"
            className={styles.backLinkText}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

