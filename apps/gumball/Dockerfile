# syntax=docker/dockerfile:1

# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate

# Copy workspace files for better layer caching
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY apps/gumball/package.json ./apps/gumball/

# Install deps (includes dev deps for building)
RUN pnpm install --frozen-lockfile

# Copy source and tsconfigs
COPY apps/gumball/tsconfig*.json ./apps/gumball/
COPY apps/gumball/src ./apps/gumball/src

# Build to build/ using tsconfig.build.json
WORKDIR /app/apps/gumball
RUN pnpm run build

# Production runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate

# Copy workspace files
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY apps/gumball/package.json ./apps/gumball/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy compiled output from builder
COPY --from=builder /app/apps/gumball/build ./apps/gumball/build

# Run the compiled JS
WORKDIR /app/apps/gumball
CMD ["node", "build/index.js"]