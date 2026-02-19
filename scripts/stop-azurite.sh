#!/bin/bash

# stop-azurite.sh
# This script stops the running Azurite (Azure Storage Emulator) instance.

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Checking for running Azurite processes...${NC}"

# Check if azurite is running
if pgrep -f "azurite" > /dev/null; then
  echo -e "${YELLOW}Found running Azurite instance(s)${NC}"

  # Kill all azurite processes
  pkill -f "azurite"

  # Wait a moment for the process to terminate
  sleep 2

  # Verify the process has been stopped
  if pgrep -f "azurite" > /dev/null; then
    echo -e "${RED}✗ Failed to stop Azurite gracefully, forcing kill...${NC}"
    pkill -9 -f "azurite"
    sleep 1
  fi

  # Final verification
  if pgrep -f "azurite" > /dev/null; then
    echo -e "${RED}✗ Failed to stop Azurite${NC}"
    exit 1
  else
    echo -e "${GREEN}✓ Azurite stopped successfully${NC}"
    exit 0
  fi
else
  echo -e "${BLUE}No Azurite process is currently running${NC}"
  exit 0
fi

