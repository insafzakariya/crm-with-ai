# Full Stack CRM Application  
### (Turborepo + React + NestJS + Prisma + PostgreSQL + Docker + pnpm)

---

## 🧠 Overview

You are an expert full-stack engineer.  
Build a **modern CRM system** using a **monorepo architecture** powered by **Turborepo** and managed with **pnpm**.  

This application includes:  
- A **React + TypeScript + Vite + Material UI** frontend  
- A **NestJS backend** with **Prisma ORM** and **PostgreSQL**  
- A **Dockerized** environment  
- Clean **repository pattern** architecture  
- Proper **DTO validation**, **Vitest unit tests**, and **Swagger documentation**

---


## 🏗️ Tech Stack

### Frontend
- React + TypeScript  
- Vite  
- Material UI (MUI)  
- React Router DOM  
- Axios (for API requests)  
- React Hook Form + Zod (form validation)  
- MUI DataGrid (for customer list)  
- Environment variables via `.env`  
- pnpm as package manager  

### Backend
- NestJS  
- Prisma ORM  
- PostgreSQL (port **5555** — different from default 5432)  
- Repository Pattern (Repository → Service → Controller)  
- DTO validation with `class-validator` and `class-transformer`  
- Swagger for API documentation  
- Connection pooling enabled  
- Vitest for unit testing  
- pnpm as package manager  

### Monorepo
- Turborepo for orchestration  
- Project layout:
  - `apps/frontend`
  - `apps/backend`
- Shared configuration can live under `packages/`

---

## ⚙️ Functional Requirements

### Dashboard
- Responsive, modern **Material UI dashboard** with navigation to “Customers”.

### Customer Management
- CRUD operations:
  - Create (form modal with validation)
  - Read (DataGrid with server-side pagination)
  - Update (form modal)
  - Delete (confirmation modal)
  - View single customer details page
- Proper loading indicators and toasts for UX feedback  
- All form validations via **React Hook Form + Zod**

### Country & State Relation
- Prisma seed script to insert:
  - Countries: **Sri Lanka**, **India**, **USA**
  - 3–5 states for each
- Dropdown linkage:
  - Selecting a country dynamically loads states for that country
- Country and State fetched from backend endpoints

---

## 🧱 Prisma Schema (Backend)

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

  state    State?   @relation(fields: [stateId], references: [id])
  country  Country? @relation(fields: [countryId], references: [id])
}

model Country {
  id     String   @id @default(uuid())
  name   String
  states State[]
}

model State {
  id        String   @id @default(uuid())
  name      String
  countryId String
  country   Country   @relation(fields: [countryId], references: [id])
}
