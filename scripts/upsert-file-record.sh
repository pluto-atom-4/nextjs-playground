#!/bin/bash

# upsert-file-record.sh
# Insert or update file metadata records in SQLite database
# Automatically triggered by file system changes

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Database file name
DB_NAME="${1:-files_meta.db}"
FILE_NAME="${2}"
CREATE_DATE="${3}"
UPDATE_DATE="${4}"
FILE_HASH="${5}"

# Check for required arguments
if [ -z "$FILE_NAME" ] || [ -z "$CREATE_DATE" ] || [ -z "$UPDATE_DATE" ] || [ -z "$FILE_HASH" ]; then
    echo -e "${RED}Usage: $0 [db_name] <file_name> <create_date> <updated_date> <hash>${NC}"
    echo ""
    echo "Example:"
    echo "  $0 files_meta.db example.txt '2023-01-01' '2024-02-19' 'abc123hash'"
    exit 1
fi

# Check if sqlite3 is installed
if ! command -v sqlite3 &> /dev/null; then
    echo -e "${RED}Error: sqlite3 is not installed${NC}"
    echo "Install it with:"
    echo "  Ubuntu/Debian: sudo apt-get install sqlite3"
    echo "  CentOS/RHEL: sudo yum install sqlite"
    exit 1
fi

echo -e "${BLUE}SQLite Upsert Record${NC}"
echo -e "${YELLOW}Database:${NC} $DB_NAME"
echo -e "${YELLOW}File:${NC} $FILE_NAME"

# Initialize database and table if they don't exist
sqlite3 "$DB_NAME" <<EOF
CREATE TABLE IF NOT EXISTS file_records (
    file_name TEXT PRIMARY KEY,
    create_date TEXT,
    updated_date TEXT,
    hash TEXT
);
EOF

# Perform the UPSERT (Insert or Update on Conflict)
sqlite3 "$DB_NAME" <<EOF
INSERT INTO file_records (file_name, create_date, updated_date, hash)
VALUES ('$FILE_NAME', '$CREATE_DATE', '$UPDATE_DATE', '$FILE_HASH')
ON CONFLICT(file_name) DO UPDATE SET
    updated_date=excluded.updated_date,
    hash=excluded.hash;
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Record for '$FILE_NAME' processed successfully${NC}"
else
    echo -e "${RED}✗ Failed to process record${NC}"
    exit 1
fi
