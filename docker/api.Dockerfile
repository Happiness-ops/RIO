# ─────────────────────────────────────────────────────────────────────────────
# Stage 1 — deps
# Install ALL dependencies (including devDeps needed to compile TypeScript).
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

# Copy workspace manifests first — lets Docker cache this layer until
# any package.json changes, not just source file changes.
COPY package.json package-lock.json* ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared-types/package.json ./packages/shared-types/

RUN npm ci --workspace=apps/api --workspace=packages/shared-types --include-workspace-root


# ─────────────────────────────────────────────────────────────────────────────
# Stage 2 — build
# Compile shared-types first (api depends on it), then compile the API.
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

COPY --from=deps /app/node_modules       ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/packages/shared-types/node_modules ./packages/shared-types/node_modules

# Copy source
COPY packages/shared-types ./packages/shared-types
COPY apps/api              ./apps/api
COPY turbo.json            ./turbo.json
COPY package.json          ./package.json

# Build shared-types first, then API
RUN npm run build --workspace=packages/shared-types
RUN npm run build --workspace=apps/api

# Generate Prisma client for production target
RUN npx prisma generate --schema=apps/api/prisma/schema.prisma


# ─────────────────────────────────────────────────────────────────────────────
# Stage 3 — production
# Lean image — only compiled JS + production node_modules.
# No TypeScript compiler, no devDependencies, no source files.
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS production

# Security: run as non-root user
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nestjs

WORKDIR /app

# Copy only what's needed to run
COPY --from=build --chown=nestjs:nodejs /app/apps/api/dist         ./dist
COPY --from=build --chown=nestjs:nodejs /app/apps/api/node_modules ./node_modules
COPY --from=build --chown=nestjs:nodejs /app/apps/api/prisma       ./prisma
COPY --from=build --chown=nestjs:nodejs /app/packages/shared-types/dist ./packages/shared-types/dist

# Copy package.json for runtime version references
COPY --chown=nestjs:nodejs apps/api/package.json ./package.json

USER nestjs

EXPOSE 3000

# Healthcheck — Docker will mark the container unhealthy if this fails
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3000/v1/health || exit 1

# Run migrations then start API
# Note: `prisma migrate deploy` is idempotent — safe to run on every start.
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
