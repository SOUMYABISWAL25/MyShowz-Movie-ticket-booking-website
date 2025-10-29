#!/bin/bash

# AWS Amplify Backend Deployment Script
# Bash script for Mac/Linux

echo ""
echo "=========================================="
echo "  AWS Amplify Backend Deployment"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo -e "${YELLOW}Checking prerequisites...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed!${NC}"
    echo -e "${YELLOW}   Please install Node.js from https://nodejs.org/${NC}"
    exit 1
fi
NODE_VERSION=$(node --version)
echo -e "${GREEN}✅ Node.js installed: ${NODE_VERSION}${NC}"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed!${NC}"
    echo -e "${YELLOW}   Please install AWS CLI from https://aws.amazon.com/cli/${NC}"
    exit 1
fi
echo -e "${GREEN}✅ AWS CLI installed${NC}"

# Check if AWS credentials are configured
echo ""
echo -e "${YELLOW}Checking AWS credentials...${NC}"
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS credentials not configured!${NC}"
    echo ""
    echo -e "${YELLOW}Please run: aws configure${NC}"
    echo -e "${YELLOW}You'll need:${NC}"
    echo -e "${CYAN}  - AWS Access Key ID${NC}"
    echo -e "${CYAN}  - AWS Secret Access Key${NC}"
    echo -e "${CYAN}  - Default region (e.g., ap-south-1)${NC}"
    exit 1
fi
echo -e "${GREEN}✅ AWS credentials configured${NC}"

# Install dependencies
echo ""
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install dependencies!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Dependencies installed${NC}"

# Deploy Amplify backend
echo ""
echo "=========================================="
echo "  Deploying Amplify Backend..."
echo "=========================================="
echo ""

echo -e "${YELLOW}⏳ This may take 2-5 minutes...${NC}"
echo ""

npx ampx sandbox

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo -e "${GREEN}  ✅ Deployment Successful!${NC}"
    echo "=========================================="
    echo ""
    
    echo -e "${CYAN}📋 Next Steps:${NC}"
    echo -e "${YELLOW}   1. Copy the User Pool ID and Client ID from above${NC}"
    echo -e "${YELLOW}   2. Run: node update-amplify-config.js${NC}"
    echo -e "${YELLOW}   3. Enter your credentials when prompted${NC}"
    echo -e "${YELLOW}   4. Test your authentication at sign_in.html${NC}"
    echo ""
else
    echo ""
    echo -e "${RED}❌ Deployment failed!${NC}"
    echo -e "${YELLOW}Please check the error messages above.${NC}"
    echo ""
fi
