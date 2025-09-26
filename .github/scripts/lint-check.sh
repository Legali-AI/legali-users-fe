#!/bin/bash

# Lint script with warning tolerance
# Allows up to 8 warnings but no errors

MAX_WARNINGS=8
TEMP_FILE="/tmp/biome_output.txt"

echo "🔍 Running Biome lint check..."
echo "📊 Maximum allowed warnings: $MAX_WARNINGS"

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
echo "   Warnings: $WARNING_COUNT"
echo "   Errors: $ERROR_COUNT"

# Show the actual output
echo ""
echo "📋 Detailed Output:"
cat "$TEMP_FILE"

# Clean up
rm -f "$TEMP_FILE"

# Decision logic
if [ "$ERROR_COUNT" -gt 0 ]; then
  echo ""
  echo "❌ FAILED: Found $ERROR_COUNT error(s). All errors must be fixed."
  exit 1
elif [ "$WARNING_COUNT" -gt "$MAX_WARNINGS" ]; then
  echo ""
  echo "❌ FAILED: Found $WARNING_COUNT warning(s), but maximum allowed is $MAX_WARNINGS."
  echo "💡 Please fix some warnings to proceed."
  exit 1
else
  echo ""
  echo "✅ PASSED: $WARNING_COUNT warning(s) is within acceptable limit ($MAX_WARNINGS)."
  exit 0
fi
