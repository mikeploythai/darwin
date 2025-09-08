# syntax=docker/dockerfile:1

# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate

# Copy lockfile and package manifest for better layer caching
COPY pnpm-lock.yaml ./
COPY apps/gumball/package.json ./

# Install deps (includes dev deps for building)
RUN pnpm install --frozen-lockfile

# Copy source and tsconfigs
COPY apps/gumball/tsconfig*.json ./
COPY apps/gumball/src ./src

# Build to build/ using tsconfig.build.json
RUN pnpm run build

# Production runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate

# Copy only what is needed at runtime
COPY pnpm-lock.yaml ./
COPY apps/gumball/package.json ./

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy compiled output from builder
COPY --from=builder /app/build ./build

# Run the compiled JS
CMD ["node", "build/index.js"]