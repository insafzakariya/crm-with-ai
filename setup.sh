#!/bin/bash

echo "🚀 CRM Application Setup"
echo "========================"
echo ""

# Check for pnpm
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Installing pnpm..."
    npm install -g pnpm@8.15.0
else
    echo "✅ pnpm is installed"
fi

# Check for Docker
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker is not installed. Please install Docker to run PostgreSQL."
    echo "   You can download it from: https://www.docker.com/products/docker-desktop"
    exit 1
else
    echo "✅ Docker is installed"
fi

echo ""
echo "📦 Installing dependencies..."
pnpm install

echo ""
echo "🐘 Starting PostgreSQL database..."
docker run -d \
  --name crm-postgres \
  -p 5555:5432 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=crm_db \
  postgres:16-alpine 2>/dev/null || docker start crm-postgres

echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

echo ""
echo "🗄️  Setting up database..."
cd apps/backend
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the development servers, run:"
echo "  pnpm dev"
echo ""
echo "Or start them separately:"
echo "  Terminal 1: cd apps/backend && pnpm dev"
echo "  Terminal 2: cd apps/frontend && pnpm dev"
echo ""
echo "Access the application:"
echo "  Frontend:     http://localhost:5173"
echo "  Backend API:  http://localhost:3001"
echo "  Swagger Docs: http://localhost:3001/api/docs"
echo ""
