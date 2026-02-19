# Replicate Azure Blob Storage Events

To replicate the behavior of Azure Blob Storage events (which trigger notifications on file creation or modification) using native Linux tools, the most efficient approach is to use the inotify kernel subsystem.

The standard tool for this is `inotifywait`, which is part of the `inotify-tools` package (available on almost every distribution).

---

## The Architecture

The architecture follows a simple **Event → Logic → Action** pipeline:

1. **Monitor:** `inotifywait` watches the directory for specific events (`close_write`, `moved_to`).
2. **Capture:** A `while` loop captures the output of the monitor in real-time.
3. **Send:** `curl` sends an HTTP POST request containing file metadata in Azure Event Grid schema format.
4. **Log:** Status feedback confirms successful or failed event transmission.

---

## The Shell Script (`monitor-blob-events.sh`)

The implemented script is located at `scripts/monitor-blob-events.sh`:

```bash
#!/bin/bash

# monitor-blob-events.sh
# Monitor a directory for file changes and trigger HTTP requests
# simulating Azure Blob Storage events

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
WATCH_DIR="${1:-.}"
TARGET_URL="${2:-http://localhost:3000/api/blob-events}"

# Check if inotifywait is installed
if ! command -v inotifywait &> /dev/null; then
    echo -e "${RED}Error: inotifywait is not installed${NC}"
    echo "Install it with:"
    echo "  Ubuntu/Debian: sudo apt-get install inotify-tools"
    echo "  CentOS/RHEL: sudo yum install inotify-tools"
    echo "  Fedora: sudo dnf install inotify-tools"
    exit 1
fi

echo -e "${BLUE}Starting Blob Storage Event Monitor${NC}"
echo -e "${YELLOW}Watching directory:${NC} $WATCH_DIR"
echo -e "${YELLOW}Target URL:${NC} $TARGET_URL"
echo ""

# Monitor for: close_write (file written and closed), moved_to (file moved in)
# --monitor: Keep running indefinitely
# --format: Output the filename
inotifywait -m -e close_write -e moved_to --format '%f' "$WATCH_DIR" | while read FILENAME
do
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} Event detected: $FILENAME"

    # Submit the HTTP request (simulating an Azure Event Grid schema)
    curl -s -X POST "$TARGET_URL" \
         -H "Content-Type: application/json" \
         -d "{
               \"topic\": \"/subscriptions/linux-local/resourceGroups/local/providers/FileSystem\",
               \"subject\": \"$WATCH_DIR/$FILENAME\",
               \"eventType\": \"Microsoft.Storage.BlobCreated\",
               \"eventTime\": \"$(date -u +'%Y-%m-%dT%H:%M:%SZ')\",
               \"data\": {
                 \"fileName\": \"$FILENAME\",
                 \"fullPath\": \"$WATCH_DIR/$FILENAME\"
               }
             }" && echo -e "${GREEN}✓ Event sent${NC}" || echo -e "${RED}✗ Failed to send event${NC}"
done
```

---

## Usage

### Basic Usage

```bash
# Watch current directory, send to default endpoint
pnpm blob:monitor

# Watch specific directory
pnpm blob:monitor ./uploads

# Watch directory and send to custom endpoint
pnpm blob:monitor ./uploads http://localhost:3000/api/events
```

### Parameters

- **directory** (optional) – Directory to monitor, defaults to `.` (current directory)
- **target-url** (optional) – HTTP endpoint to POST events to, defaults to `http://localhost:3000/api/blob-events`

### Example Output

```
Starting Blob Storage Event Monitor
Watching directory: ./uploads
Target URL: http://localhost:3000/api/blob-events

[2024-02-19 14:30:45] Event detected: document.pdf
✓ Event sent

[2024-02-19 14:30:52] Event detected: image.jpg
✓ Event sent

[2024-02-19 14:30:58] Event detected: data.json
✗ Failed to send event
```

---

## Key Components Explained

- **inotifywait:** This is the "sensor." Unlike a cron job that polls the folder every minute, this is event-driven. It sleeps until the Linux kernel notifies it that a file change occurred, making it extremely lightweight.
- **-e close_write:** Triggers after a file is fully written and closed. Using `create` instead might trigger when a file starts downloading/copying, before it's complete.
- **-e moved_to:** Triggers when files are moved/copied into the monitored directory.
- **curl:** Sends the HTTP POST request with file metadata to the target endpoint.
- **Colorized Output:** Visual feedback (green ✓, red ✗, timestamps) for monitoring events.
- **Silent curl (-s):** Suppresses curl's progress meter, keeping logs clean.

---

## Event Schema (Azure Event Grid Format)

Each event sent to the target endpoint follows the Azure Event Grid schema:

```json
{
  "topic": "/subscriptions/linux-local/resourceGroups/local/providers/FileSystem",
  "subject": "./uploads/document.pdf",
  "eventType": "Microsoft.Storage.BlobCreated",
  "eventTime": "2024-02-19T14:30:45Z",
  "data": {
    "fileName": "document.pdf",
    "fullPath": "./uploads/document.pdf"
  }
}
```

**Schema Fields:**
- **topic:** Identifies the event source (fixed to FileSystem for local monitoring)
- **subject:** Full path to the file that triggered the event
- **eventType:** Always `Microsoft.Storage.BlobCreated` (simulating blob creation)
- **eventTime:** ISO 8601 timestamp when the event occurred
- **data:** Custom metadata with filename and full path

---

## Prerequisites & Installation

### Required Tools

**inotify-tools:**
- Ubuntu/Debian: `sudo apt-get install inotify-tools`
- CentOS/RHEL: `sudo yum install inotify-tools`
- Fedora: `sudo dnf install inotify-tools`

**curl** (usually pre-installed on most Linux distributions):
- Ubuntu/Debian: `sudo apt-get install curl`
- CentOS/RHEL: `sudo yum install curl`

### Verify Installation

```bash
inotifywait --version
curl --version
```

---

## Running in the Background

To keep the monitor running even after closing your terminal, use `nohup`:

```bash
# Basic usage with nohup
nohup pnpm blob:monitor ./uploads > blob-monitor.log 2>&1 &

# Or with direct script execution
nohup bash scripts/monitor-blob-events.sh ./uploads http://localhost:3000/api/blob-events > blob-monitor.log 2>&1 &

# View logs
tail -f blob-monitor.log

# Find and stop the process
ps aux | grep monitor-blob-events.sh
kill <PID>
```

### Using systemd (Recommended for Production)

Create `/etc/systemd/system/blob-monitor.service`:

```ini
[Unit]
Description=Azure Blob Storage Event Monitor
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/path/to/nextjs-playground
ExecStart=/bin/bash scripts/monitor-blob-events.sh ./uploads http://localhost:3000/api/blob-events
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Manage with:

```bash
sudo systemctl start blob-monitor
sudo systemctl stop blob-monitor
sudo systemctl status blob-monitor
sudo systemctl enable blob-monitor  # Auto-start on boot
```

View logs:

```bash
sudo journalctl -u blob-monitor -f
```

---

## Receiving Events in Your Application

### Example Next.js API Route

Create `src/app/api/blob-events/route.ts`:

```typescript
export async function POST(request: Request) {
  try {
    const event = await request.json();
    
    console.log('Blob event received:', {
      fileName: event.data.fileName,
      fullPath: event.data.fullPath,
      eventTime: event.eventTime,
      eventType: event.eventType,
    });

    // Process event (e.g., trigger indexing, validation, etc.)
    // await processFile(event.data.fullPath);

    return Response.json(
      { success: true, message: 'Event processed' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to process blob event:', error);
    return Response.json(
      { error: 'Failed to process event' },
      { status: 400 }
    );
  }
}
```

---

## Troubleshooting

### inotifywait not installed

**Error:** `Error: inotifywait is not installed`

**Solution:** Install inotify-tools using the command for your distribution (see Prerequisites section).

### Permission denied

**Error:** `bash: scripts/monitor-blob-events.sh: Permission denied`

**Solution:** Make the script executable:

```bash
chmod +x scripts/monitor-blob-events.sh
```

### Monitor not responding to changes

**Reason:** inotify watch limit reached (system default is often too low)

**Solution:** Increase the limit:

```bash
# Check current limit
cat /proc/sys/fs/inotify/max_user_watches

# Increase temporarily (until reboot)
sudo sysctl fs.inotify.max_user_watches=524288

# Make permanent
echo "fs.inotify.max_user_watches=524288" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Events not being sent to endpoint

**Possible Causes:**
1. Target endpoint is down or unreachable
2. Firewall is blocking outbound connections
3. Endpoint URL is incorrect

**Debug:**
```bash
# Test endpoint manually
curl -X POST http://localhost:3000/api/blob-events \
  -H "Content-Type: application/json" \
  -d '{"test": "event"}'

# Monitor network connections
netstat -an | grep ESTABLISHED
```

### Port/connection errors

**Error:** `curl: (7) Failed to connect to localhost:3000`

**Solution:** Ensure the target endpoint is running and accessible. Update the endpoint URL in the script or command parameters.

---

## Performance Considerations

- **Event-Driven:** The monitor uses inotify, which is kernel-driven and very efficient (not polling)
- **Minimal Resource Usage:** Consumes minimal CPU and memory
- **Scalability:** Can monitor thousands of files without performance degradation
- **Watch Limits:** Default system limit is 8,192 watches; increase if monitoring large directories

---

## Related Scripts

- `scripts/watch-dir-upsert.sh` – File monitoring with SQLite database updates
- `scripts/upsert-file-record.sh` – SQLite record insertion/update
- `scripts/start-azurite.sh` – Azure Storage Emulator (for local blob storage testing)

See the project documentation for more details on event-driven file monitoring patterns.
