#!/bin/bash

# Pre-commit lint script with error tolerance
# Allows unlimited warnings but max 6 errors

MAX_ERRORS=6
TEMP_FILE="/tmp/biome_precommit_output.txt"

echo "🔍 Running pre-commit lint check..."
echo "📊 Maximum allowed errors: $MAX_ERRORS"
echo "⚠️  Warnings: Unlimited (allowed)"

# Run biome and capture output
if bun run lint > "$TEMP_FILE" 2>&1; then
  echo "✅ Lint check passed with no issues"
  rm -f "$TEMP_FILE"
  exit 0
fi

# Parse output to count warnings and errors
WARNING_COUNT=$(grep -c "⚠️\|warn" "$TEMP_FILE" 2>/dev/null || echo "0")
ERROR_COUNT=$(grep -c "❌\|error" "$TEMP_FILE" 2>/dev/null || echo "0")

echo "📈 Lint Results:"
echo "   Warnings: $WARNING_COUNT (allowed)"
echo "   Errors: $ERROR_COUNT"

# Show the actual output
echo ""
echo "📋 Detailed Output:"
cat "$TEMP_FILE"

# Clean up
rm -f "$TEMP_FILE"

# Decision logic - only check errors, warnings are unlimited
if [ "$ERROR_COUNT" -gt "$MAX_ERRORS" ]; then
  echo ""
  echo "❌ FAILED: Found $ERROR_COUNT error(s), but maximum allowed is $MAX_ERRORS."
  echo "💡 Please fix some errors to proceed with commit."
  exit 1
else
  echo ""
  if [ "$WARNING_COUNT" -gt 0 ]; then
    echo "✅ PASSED: $ERROR_COUNT error(s) is within acceptable limit ($MAX_ERRORS)."
    echo "⚠️  Note: $WARNING_COUNT warning(s) found but allowed for pre-commit."
  else
    echo "✅ PASSED: Clean code with no warnings or errors!"
  fi
  exit 0
fi
