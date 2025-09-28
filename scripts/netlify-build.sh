#!/bin/bash

# Netlify build script for Next.js static export
set -e

echo "🔧 Starting Netlify build process..."

# Install Bun if not available
if ! command -v bun &> /dev/null; then
    echo "📦 Installing Bun..."
    curl -fsSL https://bun.sh/install | bash
    export PATH="$HOME/.bun/bin:$PATH"
fi

echo "📦 Installing dependencies with Bun..."
bun install

echo "🔍 Running type checking..."
bun run type-check

echo "🧹 Running linting..."
bun run lint

echo "🏗️ Building for production..."
NODE_ENV=production NETLIFY=true bun run build

echo "✅ Build completed successfully!"

# Create _redirects file if it doesn't exist
if [ ! -f "out/_redirects" ]; then
    echo "📝 Creating _redirects file..."
    cat > out/_redirects << 'EOF'
# Redirect API routes to external API
/api/* https://api.legali.io/:splat 200

# Handle client-side routing
/*    /index.html   200
EOF
fi

echo "🚀 Build process complete!"
