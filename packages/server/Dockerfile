# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root configurations
COPY package.json package-lock.json tsconfig.base.json ./

# Copy the entire packages directory to satisfy workspace references
COPY packages/ ./packages/

# Install dependencies for all workspaces
RUN npm ci

# Build core first, then server
RUN npm run build -w @first-game/core
RUN npm run build -w @first-game/server

# Stage 2: Runner
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Install only production dependencies (prune devDependencies)
# We copy package files again to ensure we can run npm ci --omit=dev
COPY package.json package-lock.json ./
COPY packages/core/package.json ./packages/core/
COPY packages/client/package.json ./packages/client/
COPY packages/server/package.json ./packages/server/
RUN npm ci --omit=dev

# Copy built dist folders from the builder
COPY --from=builder /app/packages/core/dist ./packages/core/dist
COPY --from=builder /app/packages/server/dist ./packages/server/dist

# Expose server port
EXPOSE 3000

# Run as non-root user for security
USER node

# Start the server (using node directly on the compiled JS)
CMD ["node", "packages/server/dist/src/index.js"]
