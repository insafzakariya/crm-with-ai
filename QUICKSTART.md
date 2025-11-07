# Quick Start Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js >= 18.0.0
- ✅ pnpm >= 8.0.0
- ✅ Docker Desktop installed
- ⚠️ **Docker Desktop running** (check menu bar icon)

## Quick Start (3 Steps)

### 1. Start Docker Desktop

Open Docker Desktop application on your Mac and wait for it to fully start.

Verify it's running:
```bash
docker ps
```

You should see a table header with columns like CONTAINER ID, IMAGE, COMMAND, etc.

### 2. Run the Setup Script

```bash
cd /Users/insafzakariya/Development/coding-place/CRM
./start-app.sh
```

This script will:
- Start PostgreSQL on port 5555
- Run database migrations
- Seed the database with Countries & States
- Confirm everything is ready

### 3. Start the Development Servers

**Option A - Both at once (Recommended for development):**
```bash
pnpm dev
```

**Option B - Separate terminals (Recommended for debugging):**

Terminal 1 - Backend:
```bash
cd apps/backend
pnpm dev
```

Terminal 2 - Frontend:
```bash
cd apps/frontend
pnpm dev
```

## Access the Application

Once both servers are running:

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001
- **Swagger Docs:** http://localhost:3001/api/docs
- **Prisma Studio:** `cd apps/backend && pnpm prisma:studio`

## First Steps in the App

1. **Open** http://localhost:5173
2. **Click** "Customers" in the sidebar
3. **Click** "Add Customer" button
4. **Fill out** the form:
   - Select a Country (Sri Lanka, India, or USA)
   - Select a State (automatically loaded based on country)
   - Enter customer details
5. **Submit** to create your first customer

## Stopping the Application

1. **Stop the servers:** Press `Ctrl+C` in each terminal
2. **Stop PostgreSQL:** `docker stop crm-postgres`

## Restarting the Application

If you've already run setup before:

1. Start Docker Desktop
2. Start PostgreSQL: `docker start crm-postgres`
3. Start servers: `pnpm dev`

## Troubleshooting

### "Port already in use" Error

**Port 5555 (PostgreSQL):**
```bash
docker stop crm-postgres
docker rm crm-postgres
./start-app.sh
```

**Port 3001 (Backend):**
```bash
lsof -ti:3001 | xargs kill -9
cd apps/backend && pnpm dev
```

**Port 5173 (Frontend):**
```bash
lsof -ti:5173 | xargs kill -9
cd apps/frontend && pnpm dev
```

### Database Connection Issues

Reset the database:
```bash
cd apps/backend
pnpm prisma migrate reset
pnpm prisma:seed
```

### Docker Not Running

Make sure Docker Desktop is:
1. Installed
2. Running (check menu bar)
3. Fully started (icon not animating)

## Project Structure Overview

```
CRM/
├── apps/
│   ├── backend/          NestJS API (Port 3001)
│   │   ├── src/
│   │   │   ├── customer/   CRUD operations
│   │   │   ├── country/    Country endpoints
│   │   │   ├── state/      State endpoints
│   │   │   └── prisma/     Database service
│   │   └── prisma/
│   │       ├── schema.prisma
│   │       └── seed.ts
│   │
│   └── frontend/         React App (Port 5173)
│       ├── src/
│       │   ├── components/  UI components
│       │   ├── pages/       Route pages
│       │   ├── services/    API calls
│       │   └── types/       TypeScript types
│       └── index.html
│
├── start-app.sh         Automated setup script
└── README.md            Full documentation
```

## Available Commands

### Root Level
- `pnpm dev` - Start all apps
- `pnpm build` - Build all apps
- `pnpm test` - Run all tests
- `pnpm clean` - Clean build artifacts

### Backend
- `pnpm dev` - Start dev server
- `pnpm test` - Run Vitest tests
- `pnpm prisma:studio` - Open database GUI
- `pnpm prisma:migrate` - Run migrations

### Frontend
- `pnpm dev` - Start Vite dev server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build

## Need Help?

Check the full [README.md](README.md) for:
- Complete architecture documentation
- API endpoint details
- Database schema
- Testing guide
- Deployment instructions

## Happy Coding! 🚀
