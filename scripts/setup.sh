#!/bin/bash

# PasteBox Setup Script
# This script sets up the development environment

set -e

echo "🚀 Setting up PasteBox..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js version
check_node() {
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+${NC}"
        exit 1
    fi

    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        echo -e "${RED}❌ Node.js version must be 18 or higher. Current: $(node -v)${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Node.js $(node -v)${NC}"
}

# Check MongoDB
check_mongo() {
    if command -v mongosh &> /dev/null; then
        echo -e "${GREEN}✓ MongoDB CLI found${NC}"
    else
        echo -e "${YELLOW}⚠ MongoDB CLI not found. Make sure MongoDB is running.${NC}"
    fi
}

# Setup server
setup_server() {
    echo -e "\n${YELLOW}📦 Setting up server...${NC}"
    cd server

    if [ ! -f .env ]; then
        cp .env.example .env
        echo -e "${GREEN}✓ Created server/.env from example${NC}"
    else
        echo -e "${YELLOW}⚠ server/.env already exists, skipping${NC}"
    fi

    npm install
    echo -e "${GREEN}✓ Server dependencies installed${NC}"
    cd ..
}

# Setup client
setup_client() {
    echo -e "\n${YELLOW}📦 Setting up client...${NC}"
    cd client

    if [ ! -f .env ]; then
        cp .env.example .env
        echo -e "${GREEN}✓ Created client/.env from example${NC}"
    else
        echo -e "${YELLOW}⚠ client/.env already exists, skipping${NC}"
    fi

    npm install
    echo -e "${GREEN}✓ Client dependencies installed${NC}"
    cd ..
}

# Main
main() {
    check_node
    check_mongo
    setup_server
    setup_client

    echo -e "\n${GREEN}✅ Setup complete!${NC}"
    echo -e "\nTo start development:"
    echo -e "  1. Start MongoDB (if not running)"
    echo -e "  2. Run: ${YELLOW}cd server && npm run dev${NC}"
    echo -e "  3. Run: ${YELLOW}cd client && npm start${NC}"
    echo -e "\nOr use Docker:"
    echo -e "  ${YELLOW}docker-compose up${NC}"
}

main
