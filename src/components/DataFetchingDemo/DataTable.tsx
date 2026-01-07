'use client';

/**
 * DataTable component
 *
 * Generic table component for displaying structured data from API responses or database queries.
 * Supports sorting, custom column formatting, and responsive design.
 *
 * @example
 * ```tsx
 * <DataTable
 *   columns={[
 *     { key: 'id', label: 'ID', width: 'w-12' },
 *     { key: 'title', label: 'Title', render: (value) => <strong>{value}</strong> },
 *   ]}
 *   data={posts}
 *   testId="posts-table"
 * />
 * ```
 */

interface Column<T> {
  /**
   * Key from data object to display in column
   */
  key: keyof T;

  /**
   * Column header label
   */
  label: string;

  /**
   * Optional custom render function for cell content
   */
  render?: (value: T[keyof T], row: T, index: number) => React.ReactNode;

  /**
   * Optional Tailwind width class (e.g., 'w-12', 'w-1/3')
   */
  width?: string;

  /**
   * Optional text alignment class
   */
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T extends Record<string, unknown>> {
  /**
   * Column definitions
   */
  columns: Column<T>[];

  /**
   * Array of data objects to display
   */
  data: T[];

  /**
   * Optional row ID key for React keys (default: index)
   */
  rowKeyField?: keyof T;

  /**
   * Optional class name for table wrapper
   */
  className?: string;

  /**
   * Test ID for E2E testing
   */
  testId?: string;

  /**
   * Empty state message
   */
  emptyMessage?: string;
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  rowKeyField,
  className = '',
  testId,
  emptyMessage = 'No data available',
}: DataTableProps<T>) {
  const alignmentMap = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  if (data.length === 0) {
    return (
      <div
        className="text-center py-8 text-slate-500 dark:text-slate-400"
        data-testid={testId}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div
      className={`overflow-x-auto ${className}`}
      data-testid={testId}
    >
      <table className="w-full border-collapse text-sm">
        {/* Table Header */}
        <thead>
          <tr className="border-b-2 border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`px-3 py-3 font-semibold text-slate-900 dark:text-white ${
                  alignmentMap[col.align || 'left']
                } ${col.width || 'flex-1'}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {data.map((row, rowIndex) => {
            const rowKey = rowKeyField
              ? String(row[rowKeyField])
              : String(rowIndex);

            return (
              <tr
                key={rowKey}
                className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                {columns.map((col) => {
                  const cellValue = row[col.key];
                  const rendered = col.render
                    ? col.render(cellValue, row, rowIndex)
                    : String(cellValue || '-');

                  return (
                    <td
                      key={String(col.key)}
                      className={`px-3 py-3 text-slate-700 dark:text-slate-300 ${
                        alignmentMap[col.align || 'left']
                      } ${col.width || 'flex-1'}`}
                    >
                      {rendered}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

