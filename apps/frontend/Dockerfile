FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm@8.15.0

# Build stage
FROM base AS builder
WORKDIR /app

# Copy root package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY turbo.json ./

# Copy frontend app
COPY apps/frontend ./apps/frontend

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the application
WORKDIR /app/apps/frontend
RUN pnpm build

# Production stage
FROM base AS runner
WORKDIR /app

# Install serve to serve the static files
RUN pnpm add -g serve

# Copy built application
COPY --from=builder /app/apps/frontend/dist ./dist

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]
