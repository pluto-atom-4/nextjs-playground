# SQLite Upsert Shell Scripts

Automate the insertion and updating of file metadata records in SQLite using event-driven shell scripts. This guide covers the implementation in `scripts/upsert-file-record.sh` and `scripts/watch-dir-upsert.sh`.

---

## Script 1: Upsert File Record (`upsert-file-record.sh`)

The core upsert utility that inserts or updates a single file record in SQLite.

### Usage

```bash
# Direct execution
bash scripts/upsert-file-record.sh [db_name] <file_name> <create_date> <updated_date> <hash> [content_type]
```

### Parameters

- `db_name` (optional) – SQLite database file, defaults to `files_meta.db`
- `file_name` (required) – Name of the file to record
- `create_date` (required) – File creation date
- `updated_date` (required) – File modification date
- `hash` (required) – File hash (typically MD5 or SHA256)
- `content_type` (optional) – MIME type, defaults to `application/octet-stream`

### Example

```bash
bash scripts/upsert-file-record.sh files_meta.db "example.txt" "2023-01-01" "2024-02-19" "abc123hash" "text/plain"
```

### Key Features

- **Error Checking:** Validates all required arguments and checks for sqlite3 installation
- **Automatic Table Creation:** Creates `file_records` table if it doesn't exist
- **Upsert Logic:** Uses `ON CONFLICT(file_name) DO UPDATE` to update existing records
- **Content-Type Support:** Stores and updates MIME type information
- **Colorized Output:** Provides visual feedback (green ✓, red ✗, yellow warnings)
- **Exit Status:** Returns proper exit codes for scripting integration

---

## Script 2: Watch Directory with Upsert (`watch-dir-upsert.sh`)

Automatically monitor a directory for file changes and update SQLite records in real-time.

### Usage

```bash
# Direct execution
bash scripts/watch-dir-upsert.sh [directory] [db_name]

# Via NPM script
pnpm db:watch [directory] [db_name]
```

### Parameters

- `directory` (optional) – Directory to monitor, defaults to current directory (`.`)
- `db_name` (optional) – SQLite database file, defaults to `files_meta.db`

### Examples

```bash
# Watch current directory
pnpm db:watch

# Watch specific directory
pnpm db:watch ./uploads files_data.db

# Direct execution with both parameters
bash scripts/watch-dir-upsert.sh ./my_data_folder files_meta.db
```

### How It Works

1. **Validates Prerequisites:** Checks for `inotifywait` and `file` command installation
2. **Initializes Directory:** Creates the watch directory if it doesn't exist
3. **Monitors Events:** Listens for `close_write` and `moved_to` events
4. **Extracts Metadata:** Uses `stat`, `md5sum`, and `file` to gather file information
5. **Detects MIME Type:** Uses dedicated `detect_content_type()` function with validation and fallbacks
6. **Auto-Upserts:** Calls `upsert-file-record.sh` for each change with all metadata
7. **Logs Activity:** Displays timestamp and file metadata for each event

### Content-Type Detection

The script includes a dedicated `detect_content_type()` function that:

```bash
# Function to detect content-type of a file
# Returns MIME type using file command with fallbacks
detect_content_type() {
    local FILE_PATH="$1"
    local MIME_TYPE=""
    
    # Exit early if file doesn't exist
    if [ ! -f "$FILE_PATH" ]; then
        echo "application/octet-stream"
        return 1
    fi
    
    # Skip if file is a symlink (follow links)
    if [ -L "$FILE_PATH" ]; then
        FILE_PATH=$(readlink -f "$FILE_PATH")
        if [ ! -f "$FILE_PATH" ]; then
            echo "application/octet-stream"
            return 1
        fi
    fi
    
    # Detect MIME type using file command
    # -b: brief mode (no filename)
    # --mime-type: output only the MIME type
    MIME_TYPE=$(file -b --mime-type "$FILE_PATH" 2>/dev/null)
    
    # Validate MIME type format (should contain /)
    if [[ "$MIME_TYPE" =~ ^[a-z]+\/[a-z0-9\.\+\-]+$ ]]; then
        echo "$MIME_TYPE"
    else
        # Fallback to generic binary type if detection fails
        echo "application/octet-stream"
        return 1
    fi
}
```

**Key Features:**
- **File Existence Check:** Verifies file exists before detection
- **Symlink Support:** Follows symbolic links to their target files
- **MIME Type Validation:** Validates output matches standard MIME format (`type/subtype`)
- **Graceful Fallback:** Returns `application/octet-stream` if detection fails or format is invalid
- **Error Suppression:** Silently handles file command errors
- **Standards Compliant:** Produces RFC 2045/2046 compliant MIME types

### Output Example

```
Starting File System Monitor with SQLite Upsert
Monitoring directory: ./uploads
Database: files_meta.db
Press Ctrl+C to stop

[2024-02-19 14:30:45] Change detected: document.pdf
  Created: 2024-02-19 14:30:42.123456789 +0000
  Updated: 2024-02-19 14:30:42.123456789 +0000
  Hash: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
  Content-Type: application/pdf
✓ Record for 'document.pdf' processed successfully

[2024-02-19 14:30:52] Change detected: image.jpg
  Created: 2024-02-19 14:30:50.789456123 +0000
  Updated: 2024-02-19 14:30:50.789456123 +0000
  Hash: f6g7h8i9j0k1l2m3n4o5p6a1b2c3d4e5
  Content-Type: image/jpeg
✓ Record for 'image.jpg' processed successfully
```

### Key Features

- **Event-Driven:** Reacts immediately to file changes without polling
- **Automatic Metadata Extraction:** Uses `stat` and `md5sum` to gather file information
- **Robust MIME Type Detection:** Dedicated function with validation, fallbacks, and symlink support
- **Real-Time Logging:** Timestamps and detailed feedback for each event
- **Graceful Shutdown:** Respects Ctrl+C to stop monitoring
- **Error Handling:** Checks for required tools and provides installation instructions

---

## Understanding MIME Type Detection

### How the `file` Command Works

The `file` command identifies file types by examining content and metadata:

```bash
# Show MIME type only (brief mode)
file -b --mime-type document.pdf
# Output: application/pdf

# Show with filename
file --mime-type *.jpg
# Output: photo1.jpg: image/jpeg
#         photo2.jpg: image/jpeg
```

### Common MIME Types

| File Type | MIME Type |
|-----------|-----------|
| PDF | `application/pdf` |
| Word (.docx) | `application/vnd.openxmlformats-officedocument.wordprocessingml.document` |
| Excel (.xlsx) | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` |
| Images (JPEG) | `image/jpeg` |
| Images (PNG) | `image/png` |
| Images (GIF) | `image/gif` |
| Text (plain) | `text/plain` |
| Text (CSV) | `text/csv` |
| JSON | `application/json` |
| XML | `application/xml` |
| Binary (unknown) | `application/octet-stream` |

### Fallback Behavior

The detection function uses these strategies:

1. **Validates File Exists** – Returns `application/octet-stream` if file is missing
2. **Follows Symlinks** – Resolves symbolic links to actual files
3. **Validates MIME Format** – Checks for standard `type/subtype` pattern
4. **Fallback on Error** – Returns `application/octet-stream` if detection fails
5. **Silently Handles Errors** – Suppresses stderr to keep logs clean

### Example Detection Scenarios

```bash
# Normal detection
$ file -b --mime-type report.pdf
application/pdf

# Text file without extension
$ file -b --mime-type README
text/plain

# Binary file
$ file -b --mime-type executable
application/x-executable

# Symlink (script follows)
$ file -b --mime-type link_to_file.txt
text/plain

# Unknown file (fallback)
$ file -b --mime-type unknown_file
application/octet-stream
```

## Prerequisites & Installation

### Required Tools

Ensure you have the necessary tools installed:

**SQLite3:**
- Ubuntu/Debian: `sudo apt-get install sqlite3`
- CentOS/RHEL: `sudo yum install sqlite`
- Fedora: `sudo dnf install sqlite`

**inotify-tools** (for watch script):
- Ubuntu/Debian: `sudo apt-get install inotify-tools`
- CentOS/RHEL: `sudo yum install inotify-tools`
- Fedora: `sudo dnf install inotify-tools`

**file** (for MIME type detection in watch script):
- Ubuntu/Debian: `sudo apt-get install file`
- CentOS/RHEL: `sudo yum install file`
- Fedora: `sudo dnf install file`

### Verify Installation

```bash
# Check sqlite3
sqlite3 --version

# Check inotifywait
inotifywait --version

# Check file command
file --version
```

---

## Database Schema

Both scripts automatically create the following SQLite table:

```sql
CREATE TABLE IF NOT EXISTS file_records (
    file_name TEXT PRIMARY KEY,
    create_date TEXT,
    updated_date TEXT,
    hash TEXT,
    content_type TEXT
);
```

### Schema Details

- **file_name** – Primary key; must be unique within the table
- **create_date** – File creation date (ISO 8601 format)
- **updated_date** – Last modification date (ISO 8601 format)
- **hash** – File hash digest (typically MD5, SHA256, etc.)
- **content_type** – MIME type of the file (e.g., `application/pdf`, `image/jpeg`, `text/plain`)

---

## Running Scripts in the Background

To keep monitoring running even after closing your terminal, use `nohup`:

```bash
# Monitor with background process
nohup pnpm db:watch ./uploads files_meta.db > watch.log 2>&1 &

# Or with direct script execution
nohup bash scripts/watch-dir-upsert.sh ./uploads files_meta.db > watch.log 2>&1 &

# View the process
ps aux | grep watch-dir-upsert.sh

# Stop the process (use PID from ps output)
kill <PID>
```

### Using systemd (Recommended)

For production use, create a systemd service. Create `/etc/systemd/system/sqlite-monitor.service`:

```ini
[Unit]
Description=SQLite File Monitor
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/path/to/nextjs-playground
ExecStart=/bin/bash scripts/watch-dir-upsert.sh ./uploads files_meta.db
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Then manage with:

```bash
sudo systemctl start sqlite-monitor
sudo systemctl stop sqlite-monitor
sudo systemctl status sqlite-monitor
sudo systemctl enable sqlite-monitor  # Auto-start on boot
```

---

## Querying the Database

View recorded file metadata:

```bash
sqlite3 files_meta.db

# List all records
SELECT * FROM file_records;

# Find specific file
SELECT * FROM file_records WHERE file_name = 'example.txt';

# Find files by content type
SELECT file_name, content_type, updated_date FROM file_records 
WHERE content_type LIKE 'image/%'
ORDER BY updated_date DESC;

# Find recently updated files
SELECT file_name, content_type, updated_date, hash FROM file_records 
WHERE updated_date > datetime('now', '-1 hour')
ORDER BY updated_date DESC;

# Count files by content type
SELECT content_type, COUNT(*) as count FROM file_records 
GROUP BY content_type
ORDER BY count DESC;

# Exit
.exit
```

---

## Alternative Approaches

### Using entr (simpler alternative)

If you prefer a simpler tool without inotifywait, the `entr` utility is effective:

```bash
# Install entr
# Ubuntu/Debian: sudo apt install entr
# macOS: brew install entr

# Monitor directory
ls uploads/* | entr bash scripts/upsert-file-record.sh files_meta.db {} "$(date)" "$(date)" "$(md5sum {} | awk '{print $1}')"
```

### Manual Upsert

Run the upsert script manually for specific files:

```bash
FILE_PATH="file.txt"
CREATE_DATE=$(stat -c '%w' "$FILE_PATH" 2>/dev/null || stat -c '%y' "$FILE_PATH")
UPDATE_DATE=$(stat -c '%y' "$FILE_PATH")
FILE_HASH=$(md5sum "$FILE_PATH" | awk '{ print $1 }')
CONTENT_TYPE=$(file -b --mime-type "$FILE_PATH")

bash scripts/upsert-file-record.sh files_meta.db "file.txt" "$CREATE_DATE" "$UPDATE_DATE" "$FILE_HASH" "$CONTENT_TYPE"
```

---

## Troubleshooting

### inotifywait not installed

**Error:** `inotifywait is not installed`

**Solution:** Install inotify-tools using the command for your distribution (see Prerequisites section above).

### sqlite3 not installed

**Error:** `sqlite3 is not installed` or database file cannot be accessed

**Solution:** Install sqlite3 using the command for your distribution.

### Permission denied

**Error:** `bash: scripts/watch-dir-upsert.sh: Permission denied`

**Solution:** Make scripts executable:

```bash
chmod +x scripts/upsert-file-record.sh
chmod +x scripts/watch-dir-upsert.sh
```

### Monitor not responding to changes

**Reason:** inotify watch limit reached (system default is often too low)

**Solution:** Increase the limit:

```bash
# Check current limit
cat /proc/sys/fs/inotify/max_user_watches

# Increase temporarily (until reboot)
sudo sysctl fs.inotify.max_user_watches=524288

# Make permanent (add to /etc/sysctl.conf)
echo "fs.inotify.max_user_watches=524288" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```
