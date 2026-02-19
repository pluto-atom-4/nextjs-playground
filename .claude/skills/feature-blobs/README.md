# Feature: Blobs File Record Browser

**Route:** `/blobs`

A file-record browser that displays all file records stored in the database with metadata and provides a modal preview for supported content types (JSON, Markdown, plain text, CSV).

## Features

- 📋 **File Record Table**: Displays file name, content type, creation and update dates
- 👁️ **Content Preview Modal**: View file content in a modal with pretty-printed JSON and formatted text
- 🎨 **Dark/Light Theme**: Automatically adapts to the app's theme
- 🔒 **Secure**: Path traversal protection and database verification before reading files
- 📝 **Viewable Types**: `application/json`, `text/markdown`, `text/x-markdown`, `text/plain`, `text/csv`

## Quick Start

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

### 3. Start Development Server

```bash
npm run dev
```

Then navigate to `http://localhost:3000/blobs` to see the file browser.

## File Structure

```
src/app/blobs/
├── page.tsx              # async server component
├── BlobList.tsx          # 'use client' component with table & modal
└── blobs.module.css      # dark/light theme styles

src/app/api/blobs/
├── route.ts              # GET /api/blobs — list all records
└── content/route.ts      # GET /api/blobs/content?fileName= — read file content
```

## Implementation Details

**See `SKILL.md` for:**
- Complete component code
- API route implementation
- CSS styling with theme support
- Path traversal defense strategies
- Full testing checklist

## Testing Checklist

- [ ] Navigate to `/blobs` and see the file records table
- [ ] Table shows columns: File Name, Content Type, Created Date, Updated Date, Actions
- [ ] "View" button is enabled only for JSON, Markdown, plain text, and CSV files
- [ ] "View" button is disabled for other content types (grayed out)
- [ ] Click "View" to open the modal with file content
- [ ] JSON content is pretty-printed with proper formatting
- [ ] Text files display correctly in the modal
- [ ] Click the ✕ button to close the modal
- [ ] Click outside the modal to close it
- [ ] Empty table shows message if no file records exist
- [ ] Dark theme correctly colors the table and modal
- [ ] Light theme correctly colors the table and modal
- [ ] Long file names display without breaking the table layout

## Troubleshooting

**Table is empty:**
- Ensure the `file_records` table has data. Run the file watch script to populate test files:
  ```bash
  npm run watch:upload
  ```

**"File not found" error when viewing:**
- Verify the file exists in `.uploads/` directory
- Check that the file record exists in the database
- Confirm the file path is correct

**Styling issues:**
- Ensure `globals.css` defines CSS variables: `--background`, `--foreground`, `--primary`, `--muted-background`, `--border`, `--primary-foreground`
- Check that the `ThemeProvider` adds the `dark` class to `<html>` when dark mode is active

**Modal not showing:**
- Verify the CSS Module is imported correctly in BlobList.tsx
- Check browser console for errors
- Ensure the modal content type is in the VIEWABLE set

## API Endpoints

**GET /api/blobs**

Returns all file records:
```json
[
  {
    "fileName": "example.json",
    "contentType": "application/json",
    "createDate": "2026-02-19T10:30:00Z",
    "updatedDate": "2026-02-19T11:00:00Z",
    "hash": "abc123"
  }
]
```

**GET /api/blobs/content?fileName=<filename>**

Returns the file content with appropriate `Content-Type` header.

Responses:
- `200 OK` — File content returned
- `400 Bad Request` — Invalid or malicious fileName
- `404 Not Found` — File or record not found
- `500 Internal Server Error` — Server error

## Related Skills

- `feature-joy-quiz`: Interactive quiz learning module with similar UI patterns

## Notes

- The feature is fully server/client component integrated
- Theme support requires no additional hooks or context
- All styling uses CSS Modules with dark/light variants
- Database queries are optimized for the small file record set
