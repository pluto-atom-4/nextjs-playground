#!/bin/bash

# watch-dir-upsert.sh
# Monitor a directory for file changes and automatically update SQLite
# Combines inotifywait with upsert-file-record.sh
# Extracts: file_name, create_date, updated_date, hash, content_type

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
WATCH_DIR="${1:-.}"
DB_NAME="${2:-files_meta.db}"
UPSERT_SCRIPT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/upsert-file-record.sh"

# Check if inotifywait is installed
if ! command -v inotifywait &> /dev/null; then
    echo -e "${RED}Error: inotifywait is not installed${NC}"
    echo "Install it with:"
    echo "  Ubuntu/Debian: sudo apt-get install inotify-tools"
    echo "  CentOS/RHEL: sudo yum install inotify-tools"
    echo "  Fedora: sudo dnf install inotify-tools"
    exit 1
fi

# Check if file command is installed (for MIME type detection)
if ! command -v file &> /dev/null; then
    echo -e "${RED}Error: file command is not installed${NC}"
    echo "Install it with:"
    echo "  Ubuntu/Debian: sudo apt-get install file"
    echo "  CentOS/RHEL: sudo yum install file"
    echo "  Fedora: sudo dnf install file"
    exit 1
fi

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

# Create directory if it doesn't exist
mkdir -p "$WATCH_DIR"

echo -e "${BLUE}Starting File System Monitor with SQLite Upsert${NC}"
echo -e "${YELLOW}Monitoring directory:${NC} $WATCH_DIR"
echo -e "${YELLOW}Database:${NC} $DB_NAME"
echo -e "${GREEN}Press Ctrl+C to stop${NC}"
echo ""

# Monitor for: close_write (file written and closed), moved_to (file moved in)
inotifywait -m -e close_write -e moved_to --format '%f' "$WATCH_DIR" | while read FILE_NAME
do
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} Change detected: $FILE_NAME"
    
    # Get metadata for the file
    # stat -c '%w' tries to get birth time, falls back to modification time
    CREATE_DATE=$(stat -c '%w' "$WATCH_DIR/$FILE_NAME" 2>/dev/null || stat -c '%y' "$WATCH_DIR/$FILE_NAME")
    UPDATE_DATE=$(stat -c '%y' "$WATCH_DIR/$FILE_NAME")
    FILE_HASH=$(md5sum "$WATCH_DIR/$FILE_NAME" | awk '{ print $1 }')
    
    # Detect content-type using file command with validation and fallbacks
    CONTENT_TYPE=$(detect_content_type "$WATCH_DIR/$FILE_NAME")

    echo -e "${YELLOW}  Created:${NC} $CREATE_DATE"
    echo -e "${YELLOW}  Updated:${NC} $UPDATE_DATE"
    echo -e "${YELLOW}  Hash:${NC} $FILE_HASH"
    echo -e "${YELLOW}  Content-Type:${NC} $CONTENT_TYPE"

    # Run your upsert script
    bash "$UPSERT_SCRIPT" "$DB_NAME" "$FILE_NAME" "$CREATE_DATE" "$UPDATE_DATE" "$FILE_HASH" "$CONTENT_TYPE"
    echo ""
done
