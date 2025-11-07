# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack CRM application built as a **Turborepo monorepo** using pnpm workspaces. The architecture follows a clean separation between frontend and backend, with a focus on type safety and maintainable code patterns.

**Tech Stack:**
- **Monorepo:** Turborepo 2.6+ (uses `tasks` not `pipeline`)
- **Package Manager:** pnpm 8.15.0 (required)
- **Backend:** NestJS + Prisma + PostgreSQL (port 5555)
- **Frontend:** React + Vite + Material UI
- **Database:** PostgreSQL running in Docker on port 5555 (not default 5432)

## Essential Commands

### Root Level (Turborepo)
```bash
pnpm install               # Install all dependencies
pnpm dev                   # Run both apps in watch mode
pnpm build                 # Build all apps
pnpm test                  # Run all tests
```

### Backend Development (apps/backend)
```bash
cd apps/backend

# Development
pnpm dev                   # Start NestJS with hot reload

# Database
pnpm prisma:generate       # Generate Prisma Client after schema changes
pnpm prisma:migrate        # Create and run migrations
pnpm prisma:seed           # Seed database with Countries/States
pnpm prisma:studio         # Open Prisma Studio GUI

# Testing
pnpm test                  # Run Vitest tests
pnpm test:watch            # Run tests in watch mode
pnpm test:cov              # Run with coverage
```

### Frontend Development (apps/frontend)
```bash
cd apps/frontend
pnpm dev                   # Start Vite dev server (port 5173)
pnpm build                 # Build for production (TypeScript + Vite)
pnpm preview               # Preview production build
```

### Database Setup (First Time)
```bash
# Start PostgreSQL
docker run -d --name crm-postgres -p 5555:5432 \
  -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=crm_db postgres:16-alpine

# Setup database
cd apps/backend
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed
```

## Architecture Patterns

### Backend: Repository Pattern
The backend follows a strict layered architecture:

```
Controller → Service → Repository → Prisma Client → PostgreSQL
```

**Key Points:**
- **Controllers** (e.g., `customer.controller.ts`): Handle HTTP, validate with DTOs
- **Services** (e.g., `customer.service.ts`): Business logic, orchestration
- **Repositories** (e.g., `customer.repository.ts`): Data access, Prisma queries only
- **DTOs** with class-validator decorators for request validation

**Global Configuration** (apps/backend/src/main.ts):
- Global ValidationPipe with `whitelist: true`, `transform: true`
- CORS enabled for localhost:5173 and localhost:3000
- Swagger at `/api/docs`

**Database Connection:**
- PrismaService is a Global module (apps/backend/src/prisma/prisma.module.ts)
- Automatically connects on app init, disconnects on destroy
- Connection pooling configured in DATABASE_URL

### Frontend: Component-Service Pattern
```
Pages (Route components) → Reusable Components → API Services → Backend
```

**Key Points:**
- **Pages** (apps/frontend/src/pages/): Route-level components
- **Components** (apps/frontend/src/components/): Reusable UI (modals, dialogs)
- **Services** (apps/frontend/src/services/api.ts): Axios API clients (customerApi, countryApi, stateApi)
- **Types** (apps/frontend/src/types/): Shared TypeScript interfaces matching backend DTOs

**Form Validation:**
- React Hook Form + Zod for all forms
- Example: CustomerFormModal uses `zodResolver` with Zod schemas

**State Management:**
- Component-level state with useState
- Dynamic dropdowns: Country selection triggers state fetch via `stateApi.getByCountry(countryId)`

## Database Schema

**Three main models with relationships:**

```prisma
Customer {
  id, firstName, lastName, email (unique), phoneNumber, address, city
  stateId, countryId  // Optional foreign keys
  dateCreated
  relations: state, country
}

Country {
  id, name
  relations: states[], customers[]
}

State {
  id, name, countryId
  relations: country, customers[]
}
```

**Seeded Data:**
- Countries: Sri Lanka, India, USA
- 5 states per country (15 total states)
- Located in: apps/backend/prisma/seed.ts

## Environment Configuration

### Backend (.env)
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5555/crm_db?schema=public&connection_limit=5&pool_timeout=20"
PORT=3001
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001
```

**Important:** PostgreSQL runs on port **5555** (not 5432) to avoid conflicts.

## API Structure

All endpoints have Swagger documentation at http://localhost:3001/api/docs

### Customer Endpoints
- `GET /customers?page=1&limit=10&search=john` - Paginated list with search
- `GET /customers/:id` - Single customer with relations
- `POST /customers` - Create (validated with CreateCustomerDto)
- `PATCH /customers/:id` - Update (UpdateCustomerDto)
- `DELETE /customers/:id` - Delete

### Country/State Endpoints
- `GET /countries` - All countries
- `GET /countries/:id` - Country with states
- `GET /states` - All states
- `GET /states?countryId=:id` - States filtered by country

**Response Format:**
- Paginated endpoints return: `{ data: [], meta: { total, page, limit, totalPages } }`
- Single resource endpoints return the entity directly

## Common Development Workflows

### Adding a New Entity/Module

**Backend:**
1. Add Prisma model to `apps/backend/prisma/schema.prisma`
2. Run `pnpm prisma:generate && pnpm prisma:migrate`
3. Create module folder: `mkdir apps/backend/src/[entity]`
4. Create files following Repository pattern:
   - `[entity].repository.ts` - Prisma queries
   - `[entity].service.ts` - Business logic
   - `[entity].controller.ts` - HTTP handlers
   - `dto/create-[entity].dto.ts` - Request validation
   - `dto/update-[entity].dto.ts` - Usually `PartialType(CreateDto)`
5. Create module: `[entity].module.ts`
6. Import in `apps/backend/src/app.module.ts`

**Frontend:**
1. Add TypeScript interfaces to `apps/frontend/src/types/index.ts`
2. Add API client to `apps/frontend/src/services/api.ts`
3. Create page/component in `apps/frontend/src/pages/` or `apps/frontend/src/components/`

### Modifying Database Schema
```bash
cd apps/backend
# 1. Edit prisma/schema.prisma
# 2. Generate Prisma Client
pnpm prisma:generate
# 3. Create migration
pnpm prisma:migrate
# 4. Update seed if needed
# Edit prisma/seed.ts, then: pnpm prisma:seed
```

### Running Tests
Backend tests use Vitest with mocked repositories:
```bash
cd apps/backend
pnpm test                  # Run once
pnpm test:watch            # Watch mode
pnpm test:cov              # With coverage
```

Test files are in `apps/backend/test/` directory.

## Troubleshooting

### Port Conflicts
- PostgreSQL: 5555 (not standard 5432)
- Backend: 3001
- Frontend: 5173

Kill process: `lsof -ti:[PORT] | xargs kill -9`

### Database Issues
```bash
# Reset and reseed
cd apps/backend
pnpm prisma migrate reset  # Clears DB and re-runs migrations
pnpm prisma:seed           # Re-seeds data

# Force regenerate client
pnpm prisma:generate
```

### Turborepo Config
- **Important:** Turbo 2.0+ uses `tasks` not `pipeline` in turbo.json
- Dev tasks are marked as `persistent: true` for watch mode

### Docker Not Running
Backend requires PostgreSQL. If Docker isn't running:
```bash
# Start Docker Desktop, then:
docker start crm-postgres
# Or create new: see "Database Setup" above
```

## Code Style Conventions

### Backend
- Use Repository Pattern: never put Prisma queries in Services
- All DTOs must use class-validator decorators
- Services throw NotFoundException for missing entities (don't return null)
- Controllers use ValidationPipe automatically (global)

### Frontend
- Use React Hook Form + Zod for forms (see CustomerFormModal.tsx)
- API calls in try-catch with toast.error() for user feedback
- Loading states for all async operations
- MUI DataGrid for tables with server-side pagination

## Access Points

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001
- **Swagger Docs:** http://localhost:3001/api/docs
- **Prisma Studio:** `cd apps/backend && pnpm prisma:studio`
