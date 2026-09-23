# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root configurations
COPY package.json package-lock.json tsconfig.base.json ./

# Copy the entire packages directory
COPY packages/ ./packages/

# Install dependencies
RUN npm ci

# Build core first, then client
RUN npm run build -w @first-game/core
RUN npm run build -w @first-game/client

# Stage 2: Runner
FROM nginx:alpine AS runner

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built static files from builder
COPY --from=builder /app/packages/client/dist /usr/share/nginx/html

# Copy custom NGINX configuration
COPY packages/client/nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
