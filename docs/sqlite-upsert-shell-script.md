# SQLite Upsert Shell Scripts

Automate the insertion and updating of file metadata records in SQLite using event-driven shell scripts. This guide covers the implementation in `scripts/upsert-file-record.sh` and `scripts/watch-dir-upsert.sh`.

---

## Script 1: Upsert File Record (`upsert-file-record.sh`)

The core upsert utility that inserts or updates a single file record in SQLite.

### Usage

```bash
# Direct execution
bash scripts/upsert-file-record.sh [db_name] <file_name> <create_date> <updated_date> <hash>

# Via NPM script
pnpm db:upsert [db_name] <file_name> <create_date> <updated_date> <hash>
```

### Parameters

- `db_name` (optional) – SQLite database file, defaults to `files_meta.db`
- `file_name` (required) – Name of the file to record
- `create_date` (required) – File creation date
- `updated_date` (required) – File modification date
- `hash` (required) – File hash (typically MD5)

### Example

```bash
pnpm db:upsert files_meta.db "example.txt" "2023-01-01" "2024-02-19" "abc123hash"
```

### Key Features

- **Error Checking:** Validates all required arguments and checks for sqlite3 installation
- **Automatic Table Creation:** Creates `file_records` table if it doesn't exist
- **Upsert Logic:** Uses `ON CONFLICT(file_name) DO UPDATE` to update existing records
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

1. **Validates Prerequisites:** Checks for `inotifywait` installation
2. **Initializes Directory:** Creates the watch directory if it doesn't exist
3. **Monitors Events:** Listens for `close_write` and `moved_to` events
4. **Extracts Metadata:** Uses `stat` and `md5sum` to gather file information
5. **Auto-Upserts:** Calls `upsert-file-record.sh` for each change
6. **Logs Activity:** Displays timestamp and file metadata for each event

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
✓ Record for 'document.pdf' processed successfully
```

### Key Features

---

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

### Verify Installation

```bash
# Check sqlite3
sqlite3 --version

# Check inotifywait
inotifywait --version
```

---

## Database Schema

Both scripts automatically create the following SQLite table:

```sql
CREATE TABLE IF NOT EXISTS file_records (
    file_name TEXT PRIMARY KEY,
    create_date TEXT,
    updated_date TEXT,
    hash TEXT
);
```

### Schema Details

- **file_name** – Primary key; must be unique within the table
- **create_date** – File creation date (ISO 8601 format)
- **updated_date** – Last modification date (ISO 8601 format)
- **hash** – File hash digest (typically MD5, SHA256, etc.)

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

# Find recently updated files
SELECT file_name, updated_date, hash FROM file_records 
WHERE updated_date > datetime('now', '-1 hour')
ORDER BY updated_date DESC;

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
CREATE_DATE=$(stat -c '%w' file.txt 2>/dev/null || stat -c '%y' file.txt)
UPDATE_DATE=$(stat -c '%y' file.txt)
FILE_HASH=$(md5sum file.txt | awk '{ print $1 }')

pnpm db:upsert files_meta.db "file.txt" "$CREATE_DATE" "$UPDATE_DATE" "$FILE_HASH"
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
