#!/bin/bash

# start-azurite.sh
# This script starts the Azure Storage Account Emulator (Azurite)
# and ensures the data directory exists.

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Set the data directory path
AZURITE_DATA_DIR="./.azurite_data"

# Create the data directory if it doesn't exist
if [ ! -d "$AZURITE_DATA_DIR" ]; then
  echo -e "${YELLOW}Creating Azurite data directory: $AZURITE_DATA_DIR${NC}"
  mkdir -p "$AZURITE_DATA_DIR"
  echo -e "${GREEN}✓ Data directory created${NC}"
else
  echo -e "${BLUE}✓ Data directory already exists: $AZURITE_DATA_DIR${NC}"
fi

echo -e "${BLUE}Starting Azurite (Azure Storage Emulator)...${NC}"
echo -e "${YELLOW}Azurite will be available at:${NC}"
echo -e "  ${GREEN}Blob Service:${NC} http://127.0.0.1:10000"
echo -e "  ${GREEN}Queue Service:${NC} http://127.0.0.1:10001"
echo -e "  ${GREEN}Table Service:${NC} http://127.0.0.1:10002"
echo ""

# Start Azurite with the specified data directory
npx azurite --location "$AZURITE_DATA_DIR" --silent

