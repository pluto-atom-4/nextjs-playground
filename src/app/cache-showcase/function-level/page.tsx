import Link from 'next/link';
import type { Metadata } from 'next';
import { calculateFibonacci, fetchWeatherData, processUserData, getFunctionStats } from '@/lib/cache-function-operations';
import styles from './function-level.module.css';

export const metadata: Metadata = {
  title: 'Function-Level Cache | Cache Showcase',
  description: 'Learn how to use function-level caching with granular control',
};

export default async function FunctionLevelCachePage() {
  // Call cached functions
  const [fibResult, weatherResult, userResult] = await Promise.all([
    calculateFibonacci(25),
    fetchWeatherData('San Francisco'),
    processUserData('user-456'),
  ]);

  const functionStats = getFunctionStats();

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
            Function-Level Cache
          </h1>
          <p className={styles.headerSubtitle}>
            Using <code className={styles.codeInline}>'use cache'</code> for granular function-level control
          </p>
        </div>

        {/* Main Content */}
        <div className={styles.contentGrid}>
          {/* Main Panel */}
          <div className={styles.mainPanel}>
            {/* Explanation Card */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                How Function-Level Cache Works
              </h2>
              <div className={styles.cardContent}>
                <p className={styles.contentText}>
                  The <code className={styles.codeInline}>'use cache'</code> directive inside a function enables caching for just that function. This provides the finest level of control.
                </p>
                <p className={styles.contentText}>
                  Function-level caching is perfect when you want to:
                </p>
                <ul className={styles.contentList}>
                  <li className={styles.contentListItem}>Cache only specific expensive operations</li>
                  <li className={styles.contentListItem}>Have different cache strategies for different functions</li>
                  <li className={styles.contentListItem}>Cache within utility libraries</li>
                  <li className={styles.contentListItem}>Optimize particular bottlenecks in your code</li>
                </ul>
                <div className={`${styles.alertBox} ${styles.alertBoxRed}`}>
                  <p className={`${styles.alertBoxTitle} ${styles.alertBoxRedTitle}`}>⚡ Key Advantages:</p>
                  <ul className={styles.alertBoxList}>
                    <li className={styles.alertBoxListItem}>Maximum control over what gets cached</li>
                    <li className={styles.alertBoxListItem}>Can cache mixed with non-cached code</li>
                    <li className={styles.alertBoxListItem}>Optimal for performance-critical functions</li>
                    <li className={styles.alertBoxListItem}>Can be used in utility libraries</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Function Results */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>
                Cached Function Results
              </h3>

              <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                {/* Fibonacci */}
                <div className={`${styles.resultCard} ${styles.resultCardBlue}`}>
                  <h4 className={`${styles.resultCardTitle} ${styles.resultCardTitleBlue}`}>
                    <span>🔢</span> Fibonacci Calculation
                  </h4>
                  <div className={styles.codeBlock}>
                    <pre className={styles.codeBlockText}>
                      {JSON.stringify(fibResult, null, 2)}
                    </pre>
                  </div>
                </div>

                {/* Weather */}
                <div className={`${styles.resultCard} ${styles.resultCardYellow}`}>
                  <h4 className={`${styles.resultCardTitle} ${styles.resultCardTitleYellow}`}>
                    <span>🌤️</span> Weather API Call
                  </h4>
                  <div className={styles.codeBlock}>
                    <pre className={styles.codeBlockText}>
                      {JSON.stringify(weatherResult, null, 2)}
                    </pre>
                  </div>
                </div>

                {/* User Data */}
                <div className={`${styles.resultCard} ${styles.resultCardGreen}`}>
                  <h4 className={`${styles.resultCardTitle} ${styles.resultCardTitleGreen}`}>
                    <span>👤</span> User Data Processing
                  </h4>
                  <div className={styles.codeBlock}>
                    <pre className={styles.codeBlockText}>
                      {JSON.stringify(userResult, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Code Examples */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>
                Implementation Examples
              </h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                <div>
                  <h4 className={styles.practiceItemTitle}>
                    Heavy Computation:
                  </h4>
                  <div className={`${styles.codeBlockDark}`}>
                    <pre className={styles.codeBlockDarkText}>{`export async function calculateFibonacci(n: number) {
  'use cache';
  
  // This expensive calculation is cached
  const result = fib(n);
  return result;
}`}</pre>
                  </div>
                </div>

                <div>
                  <h4 className={styles.practiceItemTitle}>
                    API Call:
                  </h4>
                  <div className={`${styles.codeBlockDark}`}>
                    <pre className={styles.codeBlockDarkText}>{`export async function fetchWeatherData(city: string) {
  'use cache';
  
  // API call is cached, avoiding duplicate requests
  const weather = await fetch(\`/api/weather?city=\${city}\`);
  return weather.json();
}`}</pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Best Practices */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>
                Best Practices
              </h3>
              <div className={styles.practiceGrid}>
                <div className={styles.practiceSection}>
                  <h4 className={styles.practiceSectionTitle}>✅ Do This:</h4>
                  <ul className={styles.practicesList}>
                    <li className={styles.practicesItem}>• Cache expensive operations</li>
                    <li className={styles.practicesItem}>• Use in utility files</li>
                    <li className={styles.practicesItem}>• Cache API calls</li>
                    <li className={styles.practicesItem}>• Use for deterministic functions</li>
                  </ul>
                </div>
                <div className={styles.practiceSection}>
                  <h4 className={styles.practiceSectionTitle}>❌ Avoid This:</h4>
                  <ul className={styles.practicesList}>
                    <li className={styles.practicesItem}>• Caching non-deterministic ops</li>
                    <li className={styles.practicesItem}>• Caching highly dynamic data</li>
                    <li className={styles.practicesItem}>• Caching user-specific data</li>
                    <li className={styles.practicesItem}>• Ignoring cache invalidation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className={styles.sidebar}>
            {/* Cache Performance */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>
                Performance Metrics
              </h3>
              <div className={styles.metricsContainer}>
                {functionStats.length > 0 ? (
                  functionStats.map((stat: typeof functionStats[0]) => (
                    <div key={stat.functionName} className={styles.metricItem}>
                      <div className={styles.metricLabel}>
                        {stat.functionName}
                      </div>
                      <div className={styles.metricStats}>
                        <div>
                          <span className={`${styles.metricStatSmall} ${styles.metricStatGreen}`}>
                            H: {stat.hits}
                          </span>
                          <span className={`${styles.metricStatSmall} ${styles.metricStatOrange}`} style={{marginLeft: '0.5rem'}}>
                            M: {stat.misses}
                          </span>
                        </div>
                        <span className={`${styles.metricStatSmall} ${styles.metricStatBlue}`}>
                          {stat.executionTime.toFixed(0)}ms
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{fontSize: '0.875rem', color: 'rgb(75, 85, 99)'}}>
                    No function calls yet
                  </p>
                )}
              </div>
            </div>

            {/* Characteristics */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>
                Characteristics
              </h3>
              <ul className={styles.characteristicsList}>
                <li className={styles.characteristicsItem}>
                  <span>🎯</span>
                  <span>Finest-grained control</span>
                </li>
                <li className={styles.characteristicsItem}>
                  <span>⚡</span>
                  <span>Cache only what matters</span>
                </li>
                <li className={styles.characteristicsItem}>
                  <span>🔧</span>
                  <span>Can be in any file</span>
                </li>
                <li className={styles.characteristicsItem}>
                  <span>💾</span>
                  <span>Minimal scope</span>
                </li>
              </ul>
            </div>

            {/* When to Use */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>
                When to Use
              </h3>
              <ul className={styles.characteristicsList}>
                <li className={styles.characteristicsItem}>
                  <span>→</span>
                  <span>Specific function optimization</span>
                </li>
                <li className={styles.characteristicsItem}>
                  <span>→</span>
                  <span>Utility & helper libraries</span>
                </li>
                <li className={styles.characteristicsItem}>
                  <span>→</span>
                  <span>Mixed cache strategies</span>
                </li>
                <li className={styles.characteristicsItem}>
                  <span>→</span>
                  <span>Complex computations</span>
                </li>
              </ul>
            </div>

            {/* Navigation */}
            <div className={styles.navButtons}>
              <Link
                href="/cache-showcase/page-level"
                className={`${styles.navButton} ${styles.navButtonSecondary}`}
              >
                ← Back to Page-Level
              </Link>
              <Link
                href="/cache-showcase"
                className={`${styles.navButton} ${styles.navButtonSecondary}`}
              >
                Back to Overview
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

