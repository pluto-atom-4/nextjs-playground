import Link from 'next/link';
import type { Metadata } from 'next';
import { getExpensiveData, fetchUserProfile, getCacheMetrics } from '@/lib/cache-file-operations';
import styles from './file-level.module.css';

export const metadata: Metadata = {
  title: 'File-Level Cache | Cache Showcase',
  description: 'Learn how to use file-level caching with "use cache" directive',
};

export default async function FileLevelCachePage() {
  // These calls will be cached due to the 'use cache' directive at the file level
  const [expensiveData, userProfile] = await Promise.all([
    getExpensiveData(),
    fetchUserProfile('user-123'),
  ]);

  const metrics = getCacheMetrics();

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
            File-Level Cache
          </h1>
          <p className={styles.headerSubtitle}>
            Using the <code className={styles.codeInline}>'use cache'</code> directive at the file level
          </p>
        </div>

        {/* Main Content */}
        <div className={styles.contentGrid}>
          {/* Main Panel */}
          <div className={styles.mainPanel}>
            {/* Explanation Card */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                How File-Level Cache Works
              </h2>
              <div className={styles.cardContent}>
                <p className={styles.contentText}>
                  The <code className={styles.codeInline}>'use cache'</code> directive at the top of a file enables automatic caching for all exported functions.
                </p>
                <p className={styles.contentText}>
                  This is ideal when you have multiple related operations in a single file that all benefit from caching, such as:
                </p>
                <ul className={styles.contentList}>
                  <li className={styles.contentListItem}>Database query functions</li>
                  <li className={styles.contentListItem}>External API calls</li>
                  <li className={styles.contentListItem}>Data transformation operations</li>
                  <li className={styles.contentListItem}>Complex computations</li>
                </ul>
                <div className={`${styles.alertBox} ${styles.alertBoxInfo}`}>
                  <p className={`${styles.alertBoxTitle} ${styles.alertBoxInfoTitle}`}>✨ Key Benefits:</p>
                  <ul className={styles.alertBoxList}>
                    <li className={styles.alertBoxListItem}>Automatic caching across entire file</li>
                    <li className={styles.alertBoxListItem}>Reduces redundant computations</li>
                    <li className={styles.alertBoxListItem}>Improved performance for related operations</li>
                    <li className={styles.alertBoxListItem}>Simpler setup than function-level caching</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Data Display */}
            <div className={styles.card}>
              <h3 className={styles.cardSubtitle}>
                Cached Data Results
              </h3>

              {/* Expensive Data */}
              <div className={styles.dataDisplay}>
                <h4 className={styles.dataLabel}>
                  Expensive Database Query:
                </h4>
                <div className={styles.codeBlock}>
                  <pre className={styles.codeBlockText}>
                    {JSON.stringify(expensiveData, null, 2)}
                  </pre>
                </div>
              </div>

              {/* User Profile */}
              <div>
                <h4 className={styles.dataLabel}>
                  User Profile (API Call):
                </h4>
                <div className={styles.codeBlock}>
                  <pre className={styles.codeBlockText}>
                    {JSON.stringify(userProfile, null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            {/* Code Example */}
            <div className={styles.card}>
              <h3 className={styles.cardSubtitle}>
                Implementation Example
              </h3>
              <div className={styles.codeBlockDark}>
                <pre className={styles.codeBlockDarkText}>{`'use cache';

// All functions in this file are cached
export async function getExpensiveData() {
  const data = await fetchFromDatabase();
  return data;
}

export async function fetchUserProfile(userId: string) {
  const profile = await fetchFromAPI(\`/users/\${userId}\`);
  return profile;
}

// Cache automatically reuses results for identical calls
// Reduces redundant database queries and API calls`}</pre>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className={styles.sidebar}>
            {/* Cache Metrics */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>
                Cache Metrics
              </h3>
              <div className={styles.metricsContainer}>
                <div className={`${styles.metricBox} ${styles.metricBoxGreen}`}>
                  <div className={styles.metricLabel}>Cache Hits</div>
                  <div className={`${styles.metricValue} ${styles.metricValueGreen}`}>
                    {metrics.hits}
                  </div>
                </div>
                <div className={`${styles.metricBox} ${styles.metricBoxOrange}`}>
                  <div className={styles.metricLabel}>Cache Misses</div>
                  <div className={`${styles.metricValue} ${styles.metricValueOrange}`}>
                    {metrics.misses}
                  </div>
                </div>
                <div className={`${styles.metricBox} ${styles.metricBoxBlue}`}>
                  <div className={styles.metricLabel}>Last Updated</div>
                  <div className={`${styles.metricValue} ${styles.metricValueBlue}`} style={{fontSize: '0.75rem', fontFamily: 'monospace'}}>
                    {new Date(metrics.lastUpdated).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Best Practices */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>
                Best Practices
              </h3>
              <ul className={styles.practicesList}>
                <li className={styles.practicesItem}>
                  <span>✓</span>
                  <span>Use for related operations in same file</span>
                </li>
                <li className={styles.practicesItem}>
                  <span>✓</span>
                  <span>Great for database utilities</span>
                </li>
                <li className={styles.practicesItem}>
                  <span>✓</span>
                  <span>Monitor cache efficiency</span>
                </li>
                <li className={styles.practicesItem}>
                  <span>✓</span>
                  <span>Consider revalidation needs</span>
                </li>
              </ul>
            </div>

            {/* Navigation */}
            <div className={styles.navButtons}>
              <Link
                href="/cache-showcase/page-level"
                className={`${styles.navButton} ${styles.navButtonPrimary}`}
              >
                Next: Page-Level Cache →
              </Link>
              <Link
                href="/cache-showcase/function-level"
                className={`${styles.navButton} ${styles.navButtonSecondary}`}
              >
                Jump to Function-Level
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

