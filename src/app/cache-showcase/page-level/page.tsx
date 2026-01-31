import Link from 'next/link';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { createLogger } from '@/lib/logger';
import styles from './page-level.module.css';

const logger = createLogger({ prefix: 'PAGE-CACHE' });

// Page-level cache configuration using Next.js revalidation
export const revalidate = 60; // Revalidate every 60 seconds

// Simulate page-specific data fetching with cache
async function getPageData() {
  logger.info('Fetching page data...');

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    title: 'Page Cache Demo',
    content: 'This page demonstrates page-level caching',
    fetchedAt: new Date().toISOString(),
    revalidateIn: 60,
  };
}

// Component that shows real-time stats
async function PageStats() {
  const pageData = await getPageData();

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-4">
      <p className="text-sm text-blue-900 dark:text-blue-300">
        Page cached at: <span className="font-mono">{pageData.fetchedAt}</span>
      </p>
      <p className="text-sm text-blue-900 dark:text-blue-300 mt-2">
        Will revalidate in: <span className="font-bold">{pageData.revalidateIn}s</span>
      </p>
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Page-Level Cache | Cache Showcase',
  description: 'Learn how to use page-level caching with revalidation',
};

export default function PageLevelCachePage() {
  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        {/* Header */}
        <div className={styles.header}>
          <Link
            href="/cache-showcase"
            className={styles.backLink}
          >
            ← Back to Cache Showcase
          </Link>
          <h1 className={styles.headerTitle}>
            Page-Level Cache
          </h1>
          <p className={styles.headerSubtitle}>
            Using <code className={styles.codeInline}>revalidate</code> for page-level caching strategy
          </p>
        </div>

        {/* Main Content */}
        <div className={styles.contentGrid}>
          {/* Main Panel */}
          <div className={styles.mainPanel}>
            {/* Explanation Card */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                How Page-Level Cache Works
              </h2>
              <div className={styles.cardContent}>
                <p className={styles.contentText}>
                  Page-level caching controls how often a page is regenerated on the server. This is configured through the <code className={styles.codeInline}>revalidate</code> export.
                </p>
                <p className={styles.contentText}>
                  When you set <code className={styles.codeInline}>export const revalidate = 60</code>, the page is:
                </p>
                <ul className={styles.contentList}>
                  <li className={styles.contentListItem}>Generated and cached on first request</li>
                  <li className={styles.contentListItem}>Served from cache for subsequent requests</li>
                  <li className={styles.contentListItem}>Regenerated after 60 seconds have passed</li>
                  <li className={styles.contentListItem}>Revalidated on-demand if needed</li>
                </ul>
                <div className={`${styles.alertBox} ${styles.alertBoxPurple}`}>
                  <p className={`${styles.alertBoxTitle} ${styles.alertBoxPurpleTitle}`}>🎯 Perfect For:</p>
                  <ul className={styles.alertBoxList}>
                    <li className={styles.alertBoxListItem}>Pages with frequently changing content</li>
                    <li className={styles.alertBoxListItem}>Pages with real-time dashboards</li>
                    <li className={styles.alertBoxListItem}>Pages with user-generated content</li>
                    <li className={styles.alertBoxListItem}>Blog posts with dynamic comments</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Page Stats */}
            <div className={styles.card}>
              <h3 className={styles.cardSubtitle}>
                Cache Status
              </h3>
              <Suspense fallback={<div>Loading cache info...</div>}>
                <PageStats />
              </Suspense>
            </div>

            {/* Revalidation Strategies */}
            <div className={styles.card}>
              <h3 className={styles.cardSubtitle}>
                Revalidation Strategies
              </h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                <div className={`${styles.strategyCard} ${styles.strategyCardGreen}`}>
                  <h4 className={`${styles.strategyTitle} ${styles.strategyTitleGreen}`}>
                    Time-Based (ISR)
                  </h4>
                  <code className={`${styles.strategyCode} ${styles.strategyCodeGreen}`}>
                    export const revalidate = 60;
                  </code>
                  <p className={`${styles.strategyDescription} ${styles.strategyDescriptionGreen}`}>
                    Page regenerates every 60 seconds
                  </p>
                </div>

                <div className={`${styles.strategyCard} ${styles.strategyCardBlue}`}>
                  <h4 className={`${styles.strategyTitle} ${styles.strategyTitleBlue}`}>
                    On-Demand Revalidation
                  </h4>
                  <code className={`${styles.strategyCode} ${styles.strategyCodeBlue}`}>
                    revalidatePath('/cache-showcase/page-level');
                  </code>
                  <p className={`${styles.strategyDescription} ${styles.strategyDescriptionBlue}`}>
                    Regenerate page when specific action occurs
                  </p>
                </div>

                <div className={`${styles.strategyCard} ${styles.strategyCardOrange}`}>
                  <h4 className={`${styles.strategyTitle} ${styles.strategyTitleOrange}`}>
                    No Cache (Dynamic)
                  </h4>
                  <code className={`${styles.strategyCode} ${styles.strategyCodeOrange}`}>
                    export const revalidate = 0;
                  </code>
                  <p className={`${styles.strategyDescription} ${styles.strategyDescriptionOrange}`}>
                    Page generated on every request (no caching)
                  </p>
                </div>
              </div>
            </div>

            {/* Code Example */}
            <div className={styles.card}>
              <h3 className={styles.cardSubtitle}>
                Implementation Example
              </h3>
              <div className={styles.codeBlock}>
                <pre className={styles.codeBlockText}>{`// app/cache-showcase/page-level/page.tsx
export const revalidate = 60; // ISR: Regenerate every 60s

async function getPageData() {
  const data = await fetchLatestData();
  return data;
}

export default async function Page() {
  const data = await getPageData();
  
  return (
    <div>
      <h1>Page cached and revalidated every 60 seconds</h1>
      <p>Last updated: {data.fetchedAt}</p>
    </div>
  );
}`}</pre>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className={styles.sidebar}>
            {/* Configuration Card */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>
                Current Configuration
              </h3>
              <div className={styles.configCard}>
                <div className={styles.configItem}>
                  <div className={styles.configLabel}>Revalidate Interval</div>
                  <div className={styles.configValue}>60 seconds</div>
                </div>
                <div className={styles.configItem}>
                  <div className={styles.configLabel}>Cache Type</div>
                  <div className={`${styles.configValue} ${styles.configValueHighlight}`}>
                    ISR (Incremental Static Regeneration)
                  </div>
                </div>
                <div className={`${styles.alertBox} ${styles.alertBoxPurple}`} style={{marginTop: '0.75rem'}}>
                  <p style={{fontSize: '0.75rem', color: 'rgb(88, 28, 135)'}}>
                    This page will automatically regenerate after 60 seconds of no requests.
                  </p>
                </div>
              </div>
            </div>

            {/* Use Cases */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>
                Common Use Cases
              </h3>
              <ul className={styles.useCasesList}>
                <li className={styles.useCasesItem}>
                  <span>📰</span>
                  <span>News articles & blogs</span>
                </li>
                <li className={styles.useCasesItem}>
                  <span>🛒</span>
                  <span>Product listings</span>
                </li>
                <li className={styles.useCasesItem}>
                  <span>📊</span>
                  <span>Analytics dashboards</span>
                </li>
                <li className={styles.useCasesItem}>
                  <span>💬</span>
                  <span>User comments/reviews</span>
                </li>
                <li className={styles.useCasesItem}>
                  <span>📅</span>
                  <span>Event schedules</span>
                </li>
              </ul>
            </div>

            {/* Advantages */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>
                Advantages
              </h3>
              <ul className={styles.advantagesList}>
                <li className={styles.advantagesItem}>
                  <span>✓</span>
                  <span>Near-static performance</span>
                </li>
                <li className={styles.advantagesItem}>
                  <span>✓</span>
                  <span>Reduced server load</span>
                </li>
                <li className={styles.advantagesItem}>
                  <span>✓</span>
                  <span>Always fresh after interval</span>
                </li>
                <li className={styles.advantagesItem}>
                  <span>✓</span>
                  <span>Simple configuration</span>
                </li>
              </ul>
            </div>

            {/* Navigation */}
            <div className={styles.navButtons}>
              <Link
                href="/cache-showcase/file-level"
                className={`${styles.navButton} ${styles.navButtonSecondary}`}
              >
                ← Back to File-Level
              </Link>
              <Link
                href="/cache-showcase/function-level"
                className={`${styles.navButton} ${styles.navButtonPrimary}`}
              >
                Next: Function-Level →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

