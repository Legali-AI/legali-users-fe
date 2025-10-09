#!/bin/bash

# Update API script
# This script runs npx openapi-ts to regenerate the SDK files
# and then copies the client template to create client.gen.ts

echo "🔄 Updating API SDK..."

echo "📦 Running npx openapi-ts..."
npx openapi-ts

# Check if the command was successful
if [ $? -eq 0 ]; then
    echo "✅ SDK files regenerated successfully"

    echo "📋 Copying client template to client.gen.ts..."
    cp src/sdk/templates/client.gen.txt src/sdk/out/client.gen.ts

    if [ $? -eq 0 ]; then
        echo "✅ client.gen.ts created successfully"
        echo "🎉 API update completed!"
    else
        echo "❌ Failed to copy client template"
        echo "📁 Checking if template file exists..."
        ls -la src/sdk/templates/
        exit 1
    fi
else
    echo "❌ Failed to regenerate SDK files"
    exit 1
fi
