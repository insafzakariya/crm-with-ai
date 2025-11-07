# Full Stack CRM Application

A modern Customer Relationship Management system built with a monorepo architecture using Turborepo, React, NestJS, Prisma, PostgreSQL, and Docker.

## Tech Stack

### Frontend
- **React 18** + **TypeScript**
- **Vite** - Fast build tool
- **Material UI (MUI)** - Component library
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **React Hook Form** + **Zod** - Form validation
- **MUI DataGrid** - Data tables with pagination
- **React Toastify** - Toast notifications

### Backend
- **NestJS** - Progressive Node.js framework
- **Prisma ORM** - Database ORM
- **PostgreSQL** - Database (port 5555)
- **Repository Pattern** - Clean architecture
- **class-validator** + **class-transformer** - DTO validation
- **Swagger** - API documentation
- **Vitest** - Unit testing

### Monorepo
- **Turborepo** - Build orchestration
- **pnpm** - Package manager

## Features

### Customer Management
- ✅ Create customers with form validation
- ✅ Read customers with server-side pagination
- ✅ Update customer information
- ✅ Delete customers with confirmation
- ✅ View detailed customer information
- ✅ Search customers by name or email

### Location Management
- ✅ Countries: Sri Lanka, India, USA
- ✅ States linked to countries
- ✅ Dynamic state dropdown based on selected country

### UI/UX
- ✅ Responsive Material UI dashboard
- ✅ Loading indicators
- ✅ Toast notifications for user feedback
- ✅ Form validation with Zod
- ✅ Confirmation dialogs for destructive actions

## Project Structure

```
CRM/
├── apps/
│   ├── backend/           # NestJS backend
│   │   ├── src/
│   │   │   ├── customer/  # Customer module (Repository, Service, Controller)
│   │   │   ├── country/   # Country module
│   │   │   ├── state/     # State module
│   │   │   ├── prisma/    # Prisma service
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── seed.ts
│   │   ├── test/          # Vitest tests
│   │   └── package.json
│   │
│   └── frontend/          # React frontend
│       ├── src/
│       │   ├── components/  # Reusable components
│       │   ├── pages/       # Page components
│       │   ├── services/    # API services
│       │   ├── types/       # TypeScript types
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── index.html
│       └── package.json
│
├── docker-compose.yml     # Docker orchestration
├── turbo.json            # Turborepo config
├── pnpm-workspace.yaml   # pnpm workspace config
└── package.json          # Root package.json
```

## Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0
- **Docker** and **Docker Compose** (optional, for containerized setup)

### Installation

1. **Clone the repository**
   ```bash
   cd /Users/Development/CRM
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

### Development Setup

#### Option 1: Local Development (Recommended for Development)

1. **Start PostgreSQL** (using Docker)
   ```bash
   docker run -d \
     --name crm-postgres \
     -p 5555:5432 \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_DB=crm_db \
     postgres:16-alpine
   ```

2. **Set up the database**
   ```bash
   cd apps/backend
   pnpm prisma:generate
   pnpm prisma:migrate
   pnpm prisma:seed
   ```

3. **Start both frontend and backend**
   ```bash
   # From root directory
   pnpm dev
   ```

   Or run them separately:
   ```bash
   # Terminal 1 - Backend
   cd apps/backend
   pnpm dev

   # Terminal 2 - Frontend
   cd apps/frontend
   pnpm dev
   ```

#### Option 2: Docker Compose (Full Stack)

1. **Start all services**
   ```bash
   docker-compose up --build
   ```

   This will start:
   - PostgreSQL on port 5555
   - Backend API on port 3001
   - Frontend on port 5173

### Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001
- **Swagger Docs:** http://localhost:3001/api/docs

## Environment Variables

### Backend (`apps/backend/.env`)
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5555/crm_db?schema=public&connection_limit=5&pool_timeout=20"
PORT=3001
NODE_ENV=development
```

### Frontend (`apps/frontend/.env`)
```env
VITE_API_URL=http://localhost:3001
```

## Available Scripts

### Root Level
```bash
pnpm dev          # Run all apps in development mode
pnpm build        # Build all apps
pnpm test         # Run tests in all apps
pnpm lint         # Lint all apps
pnpm clean        # Clean all build artifacts
```

### Backend (`apps/backend`)
```bash
pnpm dev                # Start in development mode
pnpm build              # Build for production
pnpm start              # Start production build
pnpm test               # Run Vitest tests
pnpm prisma:generate    # Generate Prisma client
pnpm prisma:migrate     # Run database migrations
pnpm prisma:seed        # Seed the database
pnpm prisma:studio      # Open Prisma Studio
```

### Frontend (`apps/frontend`)
```bash
pnpm dev          # Start Vite dev server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm lint         # Lint code
```

## API Endpoints

### Customers
- `GET /customers` - Get all customers (with pagination & search)
- `GET /customers/:id` - Get customer by ID
- `POST /customers` - Create new customer
- `PATCH /customers/:id` - Update customer
- `DELETE /customers/:id` - Delete customer

### Countries
- `GET /countries` - Get all countries
- `GET /countries/:id` - Get country by ID with states

### States
- `GET /states` - Get all states
- `GET /states?countryId=:id` - Get states by country
- `GET /states/:id` - Get state by ID

## Database Schema

```prisma
model Customer {
  id           String   @id @default(uuid())
  firstName    String
  lastName     String
  email        String   @unique @db.VarChar(255)
  phoneNumber  String?
  address      String?
  city         String?
  stateId      String?
  countryId    String?
  dateCreated  DateTime @default(now())
  state        State?   @relation(fields: [stateId], references: [id])
  country      Country? @relation(fields: [countryId], references: [id])
}

model Country {
  id        String     @id @default(uuid())
  name      String
  states    State[]
  customers Customer[]
}

model State {
  id        String     @id @default(uuid())
  name      String
  countryId String
  country   Country    @relation(fields: [countryId], references: [id])
  customers Customer[]
}
```

## Testing

Run backend tests:
```bash
cd apps/backend
pnpm test
```

Run with coverage:
```bash
pnpm test:cov
```

## Architecture Patterns

### Backend - Repository Pattern
```
Controller → Service → Repository → Prisma → Database
```

- **Controllers:** Handle HTTP requests and responses
- **Services:** Business logic and orchestration
- **Repositories:** Data access layer
- **DTOs:** Data Transfer Objects with validation

### Frontend - Component Structure
```
Pages → Components → Services → API
```

- **Pages:** Route-level components
- **Components:** Reusable UI components
- **Services:** API communication
- **Types:** TypeScript interfaces

## Troubleshooting

### Port Already in Use
If port 5555, 3001, or 5173 is already in use:

1. **Find the process:**
   ```bash
   lsof -i :5555
   lsof -i :3001
   lsof -i :5173
   ```

2. **Kill the process:**
   ```bash
   kill -9 <PID>
   ```

### Database Connection Issues
1. Ensure PostgreSQL is running
2. Check DATABASE_URL in `.env`
3. Verify port 5555 is not blocked

### Prisma Issues
```bash
# Reset database
cd apps/backend
pnpm prisma migrate reset

# Regenerate client
pnpm prisma:generate
```

## Production Deployment

### Build for Production
```bash
pnpm build
```

### Using Docker
```bash
docker-compose up -d
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT

## Support

For issues and questions, please open an issue on the GitHub repository.
