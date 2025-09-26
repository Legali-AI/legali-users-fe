#!/bin/bash

# Setup branch protection for dev branch
# Usage: ./setup-dev-branch-protection.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration variables
REPO_OWNER="${GITHUB_REPOSITORY_OWNER:-Legali-AI}"
REPO_NAME="${GITHUB_REPOSITORY_NAME:-legali-users-fe}"
BRANCH_NAME="dev"
REQUIRE_UP_TO_DATE="${REQUIRE_UP_TO_DATE:-true}"  # More flexible for dev branch

echo -e "${BLUE}🛡️  Setting up Branch Protection Rules for DEV branch${NC}"
echo -e "${BLUE}Repository: ${REPO_OWNER}/${REPO_NAME}${NC}"
echo -e "${BLUE}Branch: ${BRANCH_NAME}${NC}"
echo -e "${BLUE}Require up-to-date: ${REQUIRE_UP_TO_DATE}${NC}"

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}❌ GitHub CLI (gh) is not installed${NC}"
    echo -e "${YELLOW}Please install it from: https://cli.github.com/${NC}"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo -e "${RED}❌ Not authenticated with GitHub${NC}"
    echo -e "${YELLOW}Please run: gh auth login${NC}"
    exit 1
fi

# Prepare the protection rule for dev branch (more relaxed)
PROTECTION_RULE='{
  "required_status_checks": {
    "strict": '$REQUIRE_UP_TO_DATE',
    "contexts": ["Quick Validation"]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": false,
    "require_code_owner_reviews": false,
    "require_last_push_approval": false
  },
  "restrictions": null,
  "required_conversation_resolution": false,
  "allow_force_pushes": false,
  "allow_deletions": false
}'

echo -e "${YELLOW}🔧 Applying dev branch protection rule...${NC}"

# Apply the protection rule
if gh api repos/"${REPO_OWNER}"/"${REPO_NAME}"/branches/"${BRANCH_NAME}"/protection \
    --method PUT \
    --input - <<< "$PROTECTION_RULE"; then

    echo -e "${GREEN}✅ Dev branch protection rule applied successfully!${NC}"
    echo ""
    echo -e "${BLUE}📋 Dev Branch Protection Summary:${NC}"
    echo -e "  • Required status checks: Quick Validation"
    echo -e "  • Require up-to-date branches: ${REQUIRE_UP_TO_DATE}"
    echo -e "  • Required approvals: 1"
    echo -e "  • Dismiss stale reviews: No (flexible for dev)"
    echo -e "  • Require conversation resolution: No"
    echo -e "  • Enforce for admins: No (dev flexibility)"
    echo -e "  • Allow force pushes: No"
    echo -e "  • Allow deletions: No"

else
    echo -e "${RED}❌ Failed to apply dev branch protection rule${NC}"
    echo -e "${YELLOW}💡 Make sure you have admin permissions on the repository${NC}"
    exit 1
fi
