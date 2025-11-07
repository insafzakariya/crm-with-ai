#!/bin/bash

echo "🚀 Starting CRM Application"
echo "============================"
echo ""

# Check if Docker is running
if ! docker ps > /dev/null 2>&1; then
    echo "❌ Docker is not running!"
    echo "Please start Docker Desktop and run this script again."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Start PostgreSQL
echo "🐘 Starting PostgreSQL database..."
docker run -d \
  --name crm-postgres \
  -p 5555:5432 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=crm_db \
  postgres:16-alpine 2>/dev/null || docker start crm-postgres 2>/dev/null

echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 8

# Check if PostgreSQL is ready
until docker exec crm-postgres pg_isready -U postgres > /dev/null 2>&1; do
  echo "   Still waiting for PostgreSQL..."
  sleep 2
done

echo "✅ PostgreSQL is ready!"
echo ""

# Check if migrations already exist
if [ ! -d "apps/backend/prisma/migrations" ]; then
  echo "🗄️  Running database migrations..."
  cd apps/backend
  pnpm prisma migrate dev --name init
  echo ""

  echo "🌱 Seeding database with initial data..."
  pnpm prisma:seed
  echo ""
  cd ../..
else
  echo "✅ Database migrations already exist"
  echo ""
fi

echo "✅ Setup complete!"
echo ""
echo "=============================="
echo "🎉 Ready to start the servers!"
echo "=============================="
echo ""
echo "Run these commands in separate terminals:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd apps/backend && pnpm dev"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd apps/frontend && pnpm dev"
echo ""
echo "Or start both at once:"
echo "  pnpm dev"
echo ""
echo "Access URLs:"
echo "  Frontend:     http://localhost:5173"
echo "  Backend API:  http://localhost:3001"
echo "  Swagger Docs: http://localhost:3001/api/docs"
echo ""
