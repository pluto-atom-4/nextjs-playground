# DataFetchingDemo Components

Reusable components for building consistent data fetching demonstrations across the Next.js app.

## Components

### DemoSection
Layout wrapper for demo content with title, description, and optional documentation link.

**Usage:**
```tsx
import { DemoSection } from '@/components/DataFetchingDemo';

<DemoSection
  title="Server Fetch with Revalidate"
  description="Demonstrates fetch API with revalidateTag for cache invalidation"
  codeLink="https://nextjs.org/docs/app/api-reference/functions/revalidateTag"
  testId="demo-section-server-fetch"
>
  {/* Demo content here */}
</DemoSection>
```

**Props:**
- `title` (string) - Section title
- `description` (string) - Pattern description
- `children` (ReactNode) - Main content
- `codeLink?` (string) - Optional docs/code link
- `className?` (string) - Custom styles
- `testId?` (string) - E2E test ID

---

### LoadingSkeleton
Placeholder skeleton loader with multiple variants for different layouts.

**Variants:**
- `list` (default) - Linear list of skeleton items
- `card` - Card-based layout with multiple lines
- `table` - Table rows and columns

**Usage:**
```tsx
import { LoadingSkeleton } from '@/components/DataFetchingDemo';

<Suspense fallback={<LoadingSkeleton count={5} variant="card" height="h-16" />}>
  <DataComponent />
</Suspense>
```

**Props:**
- `count?` (number) - Number of skeleton rows (default: 3)
- `height?` (string) - Tailwind height class (default: 'h-8')
- `variant?` ('list' | 'card' | 'table') - Layout variant (default: 'list')
- `className?` (string) - Custom wrapper styles
- `testId?` (string) - E2E test ID

---

### DataTable
Generic table component for displaying structured data with sorting and custom rendering.

**Features:**
- Responsive horizontal scrolling
- Custom cell rendering
- Sortable columns
- Empty state handling
- Dark mode support

**Usage:**
```tsx
import { DataTable } from '@/components/DataFetchingDemo';

interface Post {
  id: number;
  title: string;
  authorId: number;
  createdAt: string;
}

const posts: Post[] = [/* data */];

<DataTable<Post>
  columns={[
    { key: 'id', label: 'ID', width: 'w-12', align: 'center' },
    { key: 'title', label: 'Title', width: 'flex-1' },
    {
      key: 'authorId',
      label: 'Author',
      render: (value) => `User ${value}`,
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (date) => new Date(date as string).toLocaleDateString(),
    },
  ]}
  data={posts}
  rowKeyField="id"
  emptyMessage="No posts found"
  testId="posts-table"
/>
```

**Props:**
- `columns` (Column[]) - Column definitions
- `data` (T[]) - Array of data objects
- `rowKeyField?` (keyof T) - Field to use for React keys
- `className?` (string) - Custom wrapper styles
- `testId?` (string) - E2E test ID
- `emptyMessage?` (string) - Message when no data (default: 'No data available')

**Column Options:**
```tsx
interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value, row, index) => ReactNode;
  width?: string; // Tailwind class (e.g., 'w-12', 'w-1/3')
  align?: 'left' | 'center' | 'right';
}
```

---

### MetricsPanel
Dashboard-style grid of metrics cards showing performance data and statistics.

**Variants:**
- `default` - Blue background
- `success` - Green background (for successful operations)
- `warning` - Yellow background (for warnings)
- `error` - Red background (for errors)

**Usage:**
```tsx
import { MetricsPanel } from '@/components/DataFetchingDemo';

<MetricsPanel
  title="Performance Metrics"
  columns={2}
  metrics={[
    {
      label: 'Total Items',
      value: '42',
      icon: '📊',
      variant: 'default',
    },
    {
      label: 'Fetch Time',
      value: '125ms',
      icon: '⏱️',
      tooltip: 'Time to fetch all data',
      variant: 'success',
    },
    {
      label: 'Cache Status',
      value: 'HIT',
      icon: '✓',
      highlight: true,
      variant: 'success',
    },
    {
      label: 'Errors',
      value: '0',
      icon: '⚠️',
      variant: 'default',
    },
  ]}
  testId="metrics-panel"
/>
```

**Props:**
- `metrics` (Metric[]) - Array of metric objects
- `title?` (string) - Optional panel title
- `columns?` (1 | 2 | 3 | 4) - Grid columns (default: 2)
- `className?` (string) - Custom wrapper styles
- `testId?` (string) - E2E test ID

**Metric Options:**
```tsx
interface Metric {
  label: string;
  value: string | number;
  icon?: string;
  highlight?: boolean;
  tooltip?: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
}
```

---

### ErrorFallback
Error display component with recovery actions and debugging information.

**Features:**
- Error severity detection (4xx warning, 5xx error)
- Optional stack trace (development only)
- Recovery suggestions with optional links
- Retry and home navigation buttons
- Dark mode support

**Usage - Error Boundary:**
```tsx
'use client';

import { ErrorFallback } from '@/components/DataFetchingDemo';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="p-6">
      <ErrorFallback
        error={error}
        errorCode="500"
        onReset={reset}
        suggestions={[
          'Check your database connection',
          'Verify API endpoint is running',
          {
            label: 'View Documentation',
            href: 'https://nextjs.org/docs',
          },
        ]}
        testId="error-fallback"
      />
    </div>
  );
}
```

**Usage - Manual Error Handling:**
```tsx
try {
  const data = await fetchData();
} catch (error) {
  return (
    <ErrorFallback
      error={error}
      errorCode={error.statusCode}
      message="Failed to load posts. Please try again."
      onReset={() => window.location.reload()}
    />
  );
}
```

**Props:**
- `error?` (Error | string) - Error object or message
- `onReset?` () => void - Reset/retry callback
- `title?` (string) - Error title (default: 'Something went wrong')
- `message?` (string) - Custom error message
- `suggestions?` (string[] | { label, href }[]) - Recovery suggestions
- `errorCode?` (string | number) - Error code (auto-detects severity)
- `showStack?` (boolean) - Show stack trace (default: dev only)
- `className?` (string) - Custom wrapper styles
- `testId?` (string) - E2E test ID

---

## Integration Examples

### Complete Data Fetching Demo Section
```tsx
'use client';

import { Suspense } from 'react';
import {
  DemoSection,
  LoadingSkeleton,
  DataTable,
  MetricsPanel,
} from '@/components/DataFetchingDemo';

interface Post {
  id: number;
  title: string;
  body: string;
}

async function PostsData() {
  const start = Date.now();
  const response = await fetch('https://api.example.com/posts');
  const data: Post[] = await response.json();
  const duration = Date.now() - start;

  return (
    <>
      <MetricsPanel
        metrics={[
          { label: 'Total Posts', value: data.length, icon: '📄' },
          { label: 'Fetch Time', value: `${duration}ms`, icon: '⏱️' },
        ]}
      />
      <DataTable<Post>
        columns={[
          { key: 'id', label: 'ID', width: 'w-12' },
          { key: 'title', label: 'Title', width: 'flex-1' },
          { key: 'body', label: 'Content', width: 'flex-1' },
        ]}
        data={data}
        testId="posts-table"
      />
    </>
  );
}

export default function ServerFetchPage() {
  return (
    <DemoSection
      title="Server-Side Fetch with Metrics"
      description="Demonstrates fetch API in Server Component with performance metrics"
      testId="server-fetch-demo"
    >
      <Suspense
        fallback={
          <LoadingSkeleton count={5} variant="table" height="h-6" />
        }
      >
        <PostsData />
      </Suspense>
    </DemoSection>
  );
}
```

---

## Styling & Theming

All components support:
- **Dark Mode**: Built-in dark mode support using Tailwind's `dark:` prefix
- **Custom Classes**: Pass `className` prop for additional styling
- **Responsive Design**: Adapts to mobile, tablet, and desktop screens
- **Consistent Spacing**: Uses Tailwind's spacing scale for consistency

### Component Color Scheme
- Primary: Slate (dark) / White (light)
- Accent: Blue (primary), Green (success), Yellow (warning), Red (error)
- Borders: Slate 200/700 based on theme
- Backgrounds: Slate 50/900 based on theme

---

## Testing Integration

All components include optional `testId` props for E2E testing:

```tsx
// Playwright example
await page.getByTestId('demo-section-server-fetch').isVisible();
await page.getByTestId('posts-table').getByRole('row').count();
await expect(page.getByTestId('error-fallback')).toContainText('try again');
```

---

## Best Practices

1. **Always use Suspense with LoadingSkeleton** - Provides better UX while data loads
2. **Include testId attributes** - Enables reliable E2E testing
3. **Use MetricsPanel for transparency** - Show users what's happening with their data
4. **Consistent error handling** - Use ErrorFallback in all error.tsx files
5. **Responsive design** - Test components on mobile before deployment

---

## Related Documentation

- [Next.js Data Fetching](https://nextjs.org/docs/app/getting-started/fetching-data)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Prisma ORM](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com)

