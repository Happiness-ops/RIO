# ─────────────────────────────────────────────────────────────────────────────
# workers.Dockerfile
#
# Identical build stages to api.Dockerfile.
# The only difference is the final CMD — workers run a separate entry point
# that boots only the WorkersModule (no HTTP server, no controllers).
#
# This means:
#  - Workers can be scaled independently from the API
#  - A worker crash doesn't take down the API
#  - No HTTP port is exposed from this container
# ─────────────────────────────────────────────────────────────────────────────

FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json* ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared-types/package.json ./packages/shared-types/

RUN npm ci --workspace=apps/api --workspace=packages/shared-types --include-workspace-root


FROM node:20-alpine AS build

WORKDIR /app

COPY --from=deps /app/node_modules                      ./node_modules
COPY --from=deps /app/apps/api/node_modules             ./apps/api/node_modules
COPY --from=deps /app/packages/shared-types/node_modules ./packages/shared-types/node_modules

COPY packages/shared-types ./packages/shared-types
COPY apps/api              ./apps/api
COPY turbo.json            ./turbo.json
COPY package.json          ./package.json

RUN npm run build --workspace=packages/shared-types
RUN npm run build --workspace=apps/api

RUN npx prisma generate --schema=apps/api/prisma/schema.prisma


FROM node:20-alpine AS production

RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 worker

WORKDIR /app

COPY --from=build --chown=worker:nodejs /app/apps/api/dist         ./dist
COPY --from=build --chown=worker:nodejs /app/apps/api/node_modules ./node_modules
COPY --from=build --chown=worker:nodejs /app/apps/api/prisma       ./prisma
COPY --from=build --chown=worker:nodejs /app/packages/shared-types/dist ./packages/shared-types/dist

COPY --chown=worker:nodejs apps/api/package.json ./package.json

USER worker

# Workers do not expose HTTP — no EXPOSE, no HEALTHCHECK over HTTP.
# Docker health is inferred from process exit code instead.

# Entry point: worker-specific bootstrap file (boots WorkersModule only)
CMD ["node", "dist/worker.main.js"]
