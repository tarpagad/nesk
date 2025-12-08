#!/bin/bash

# NESK Setup Script

echo "🚀 Setting up NESK project..."

# Check if Prisma dev server is running
if ! lsof -i:51213 > /dev/null 2>&1; then
  echo "📦 Starting Prisma dev server..."
  bunx prisma dev &
  PRISMA_PID=$!
  sleep 5
  echo "✅ Prisma dev server started (PID: $PRISMA_PID)"
else
  echo "✅ Prisma dev server already running"
fi

# Run migrations
echo "🔄 Running database migrations..."
bunx prisma migrate dev --name init

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
bunx prisma generate

echo ""
echo "✨ Setup complete! You can now run:"
echo "   bun dev"
echo ""
