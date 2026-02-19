---
name: feature-blobs
description: File record browser with metadata list, content preview modal, and dark/light theme support
license: MIT
---

# Feature: Blobs File Record Browser

## Overview

A complete implementation of a file-record browser for the Next.js playground. This feature displays a list of all file records stored in the database, shows their metadata, and provides a modal to preview the content of viewable file types.

## Architecture

### Data Model

The feature uses a Prisma `FileRecord` model that mirrors the existing `file_records` SQLite table:

```prisma
model FileRecord {
  fileName    String  @id @map("file_name")
  createDate  String? @map("create_date")
  updatedDate String? @map("updated_date")
  hash        String?
  contentType String? @map("content_type")
  @@map("file_records")
}
```

### API Routes

#### GET /api/blobs

Returns all file records from the database.

**Response:**
```json
[
  {
    "fileName": "example.json",
    "createDate": "2026-02-19T10:30:00Z",
    "updatedDate": "2026-02-19T11:00:00Z",
    "hash": "abc123def456",
    "contentType": "application/json"
  }
]
```

#### GET /api/blobs/content?fileName=<filename>

Reads and returns the file content from the `.uploads/` directory.

**Security considerations:**
- Validate that `fileName` does not contain `/`, `\`, or `..`
- Use `path.resolve()` to ensure the resolved path stays within `.uploads/`
- Verify the file record exists in the database before reading disk
- Set appropriate `Content-Type` headers

**Response:**
```
200 OK
Content-Type: application/json (or appropriate type)

(file content)
```

**Error responses:**
- `400 Bad Request` — Invalid or malicious fileName
- `404 Not Found` — File not found or not in database
- `500 Internal Server Error` — Server error reading file

### UI Components

#### Server Component: `/blobs` (page.tsx)

- Async server component using `db.fileRecord.findMany()`
- Renders `BlobList` client component with initial file records
- No pre-filtering; displays all records

```tsx
// src/app/blobs/page.tsx
import { db } from '@/lib/db';
import BlobList from './BlobList';

export default async function BlobsPage() {
  const fileRecords = await db.fileRecord.findMany();
  return (
    <main>
      <h1>File Records</h1>
      <BlobList initialRecords={fileRecords} />
    </main>
  );
}
```

#### Client Component: BlobList (BlobList.tsx)

'use client' component that:
- Displays file records in a table with columns: File Name, Content Type, Created Date, Updated Date, Actions
- Includes a "View" button for each record (enabled only for viewable content types)
- Shows a modal for content preview when "View" is clicked
- Displays loading and empty states appropriately
- Fetches content via `/api/blobs/content?fileName=<filename>`

**Viewable content types:**
```ts
const VIEWABLE = new Set([
  'application/json',
  'text/markdown',
  'text/x-markdown',
  'text/plain',
  'text/csv'
]);
```

**Modal rendering:**
- For JSON: pretty-print with 2-space indentation
- For text types: plain text display

### Styling

#### CSS Modules (blobs.module.css)

Use CSS Modules with dark/light theme support via `:global(.dark)` selectors:

```css
/* Base styles */
.table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--background);
  color: var(--foreground);
}

.tableHeader {
  background-color: var(--muted-background);
  color: var(--foreground);
}

.tableCell {
  padding: 0.75rem;
  border-bottom: 1px solid var(--border);
}

.viewButton {
  padding: 0.5rem 1rem;
  background-color: var(--primary);
  color: var(--primary-foreground);
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.viewButton:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal.open {
  display: flex;
  align-items: center;
  justify-content: center;
}

.modalContent {
  background-color: var(--background);
  color: var(--foreground);
  border-radius: 0.5rem;
  padding: 2rem;
  max-width: 80%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

:global(.dark) .modalContent {
  background-color: var(--background);
  color: var(--foreground);
}

.preContent {
  background-color: var(--muted-background);
  padding: 1rem;
  border-radius: 0.25rem;
  font-family: monospace;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
}

.closeButton {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--foreground);
}
```

## File Structure

```
src/app/blobs/
├── page.tsx              # async server component
├── BlobList.tsx          # 'use client' component
└── blobs.module.css      # styling with dark/light theme

src/app/api/blobs/
├── route.ts              # GET /api/blobs
└── content/
    └── route.ts          # GET /api/blobs/content?fileName=
```

## Implementation Steps

### 1. Update Prisma Schema

Add the `FileRecord` model to `prisma/schema.prisma`:

```prisma
model FileRecord {
  fileName    String  @id @map("file_name")
  createDate  String? @map("create_date")
  updatedDate String? @map("updated_date")
  hash        String?
  contentType String? @map("content_type")
  @@map("file_records")
}
```

### 2. Create and Run Migration

```bash
npx prisma migrate dev --name add_file_records
npx prisma generate
```

This creates the migration and updates the Prisma client.

### 3. Create API Routes

**`src/app/api/blobs/route.ts`:**
```ts
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const fileRecords = await db.fileRecord.findMany();
    return NextResponse.json(fileRecords);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch file records' },
      { status: 500 }
    );
  }
}
```

**`src/app/api/blobs/content/route.ts`:**
```ts
import { readFile } from 'fs/promises';
import path from 'path';
import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/db';

const UPLOADS_DIR = path.resolve(process.cwd(), '.uploads');

export async function GET(request: NextRequest) {
  const fileName = request.nextUrl.searchParams.get('fileName');

  // Validate fileName
  if (!fileName) {
    return NextResponse.json(
      { error: 'fileName parameter required' },
      { status: 400 }
    );
  }

  if (fileName.includes('/') || fileName.includes('\\') || fileName.includes('..')) {
    return NextResponse.json(
      { error: 'Invalid file name' },
      { status: 400 }
    );
  }

  // Path traversal defense
  const filePath = path.resolve(UPLOADS_DIR, fileName);
  if (!filePath.startsWith(UPLOADS_DIR + path.sep)) {
    return NextResponse.json(
      { error: 'Path traversal detected' },
      { status: 400 }
    );
  }

  // Verify record exists in database
  const record = await db.fileRecord.findUnique({
    where: { fileName }
  });

  if (!record) {
    return NextResponse.json(
      { error: 'File record not found' },
      { status: 404 }
    );
  }

  try {
    const content = await readFile(filePath, 'utf-8');
    return new NextResponse(content, {
      headers: {
        'Content-Type': record.contentType || 'text/plain'
      }
    });
  } catch {
    return NextResponse.json(
      { error: 'File not found on disk' },
      { status: 404 }
    );
  }
}
```

### 4. Create Page Component

**`src/app/blobs/page.tsx`:**
```tsx
import { db } from '@/lib/db';
import BlobList from './BlobList';

export default async function BlobsPage() {
  const fileRecords = await db.fileRecord.findMany();

  return (
    <main>
      <h1>File Records</h1>
      <BlobList initialRecords={fileRecords} />
    </main>
  );
}
```

### 5. Create Client Component

**`src/app/blobs/BlobList.tsx`:**
```tsx
'use client';

import { useState } from 'react';
import styles from './blobs.module.css';

interface FileRecord {
  fileName: string;
  createDate?: string;
  updatedDate?: string;
  hash?: string;
  contentType?: string;
}

interface BlobListProps {
  initialRecords: FileRecord[];
}

const VIEWABLE = new Set([
  'application/json',
  'text/markdown',
  'text/x-markdown',
  'text/plain',
  'text/csv'
]);

export default function BlobList({ initialRecords }: BlobListProps) {
  const [fileRecords, setFileRecords] = useState<FileRecord[]>(initialRecords);
  const [selectedFile, setSelectedFile] = useState<FileRecord | null>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleView = async (record: FileRecord) => {
    setSelectedFile(record);
    setLoading(true);
    try {
      const response = await fetch(`/api/blobs/content?fileName=${encodeURIComponent(record.fileName)}`);
      if (!response.ok) throw new Error('Failed to fetch content');
      const text = await response.text();
      setContent(text);
    } catch (error) {
      setContent(`Error loading content: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const isViewable = (contentType?: string) => {
    return contentType && VIEWABLE.has(contentType);
  };

  const formatContent = (text: string, contentType?: string) => {
    if (contentType === 'application/json') {
      try {
        return JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        return text;
      }
    }
    return text;
  };

  if (fileRecords.length === 0) {
    return <p>No file records found.</p>;
  }

  return (
    <>
      <table className={styles.table}>
        <thead className={styles.tableHeader}>
          <tr>
            <th className={styles.tableCell}>File Name</th>
            <th className={styles.tableCell}>Content Type</th>
            <th className={styles.tableCell}>Created Date</th>
            <th className={styles.tableCell}>Updated Date</th>
            <th className={styles.tableCell}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fileRecords.map((record) => (
            <tr key={record.fileName}>
              <td className={styles.tableCell}>{record.fileName}</td>
              <td className={styles.tableCell}>{record.contentType || '—'}</td>
              <td className={styles.tableCell}>{record.createDate ? new Date(record.createDate).toLocaleString() : '—'}</td>
              <td className={styles.tableCell}>{record.updatedDate ? new Date(record.updatedDate).toLocaleString() : '—'}</td>
              <td className={styles.tableCell}>
                <button
                  className={styles.viewButton}
                  onClick={() => handleView(record)}
                  disabled={!isViewable(record.contentType)}
                  title={isViewable(record.contentType) ? 'View content' : 'Content type not viewable'}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedFile && (
        <div className={`${styles.modal} ${selectedFile ? styles.open : ''}`} onClick={() => setSelectedFile(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setSelectedFile(null)}>✕</button>
            <h2>{selectedFile.fileName}</h2>
            {loading && <p>Loading...</p>}
            {!loading && (
              <pre className={styles.preContent}>
                {formatContent(content, selectedFile.contentType)}
              </pre>
            )}
          </div>
        </div>
      )}
    </>
  );
}
```

### 6. Create Styles

**`src/app/blobs/blobs.module.css`:**
```css
.table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--background);
  color: var(--foreground);
  margin-top: 1rem;
}

.tableHeader {
  background-color: var(--muted-background);
  color: var(--foreground);
}

.tableCell {
  padding: 0.75rem;
  border-bottom: 1px solid var(--border);
  text-align: left;
}

.tableHeader .tableCell {
  font-weight: 600;
  padding: 1rem 0.75rem;
}

.viewButton {
  padding: 0.5rem 1rem;
  background-color: var(--primary);
  color: var(--primary-foreground);
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: opacity 0.2s;
}

.viewButton:hover:not(:disabled) {
  opacity: 0.8;
}

.viewButton:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal.open {
  display: flex;
  align-items: center;
  justify-content: center;
}

.modalContent {
  background-color: var(--background);
  color: var(--foreground);
  border-radius: 0.5rem;
  padding: 2rem;
  max-width: 80%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
}

:global(.dark) .modalContent {
  background-color: var(--background);
  color: var(--foreground);
}

.preContent {
  background-color: var(--muted-background);
  padding: 1rem;
  border-radius: 0.25rem;
  font-family: monospace;
  font-size: 0.875rem;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
  margin: 1rem 0 0 0;
  line-height: 1.5;
}

.closeButton {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--foreground);
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.closeButton:hover {
  opacity: 0.7;
}
```

## Theme Support

The feature integrates seamlessly with Next.js's dark/light theme system:

- **No additional hooks needed**: The component uses CSS Modules with `:global(.dark)` selectors
- **Color variables**: References `var(--background)`, `var(--foreground)`, `var(--muted-background)`, `var(--primary)`, etc. from `globals.css`
- **Automatic theme detection**: The `ThemeProvider` adds the `dark` class to the `<html>` element, cascading to all selectors
- **Modal overlay**: Uses CSS-based modal positioning and dark background for visual separation

## Path Traversal Protection

The content API route implements multiple layers of security:

1. **Character validation**: Rejects `fileName` containing `/`, `\`, or `..`
2. **Path resolution check**: Uses `path.resolve()` and verifies the result stays within `.uploads/`
3. **Database verification**: Confirms the file record exists before reading from disk
4. **Error handling**: Returns appropriate HTTP status codes for different error scenarios

## Testing Checklist

- [ ] Table displays all file records with correct columns
- [ ] View button is enabled only for viewable content types
- [ ] View button is disabled for non-viewable content types
- [ ] Modal opens when View button is clicked
- [ ] JSON content is pretty-printed in modal
- [ ] Text content displays correctly in modal
- [ ] Modal closes when close button (✕) is clicked
- [ ] Modal closes when background is clicked
- [ ] Empty state message displays when no records exist
- [ ] Dark theme applies correct colors
- [ ] Light theme applies correct colors
- [ ] Long file names don't break table layout
- [ ] Modal content scrolls correctly for large files
