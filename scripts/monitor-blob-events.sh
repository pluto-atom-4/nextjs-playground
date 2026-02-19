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
