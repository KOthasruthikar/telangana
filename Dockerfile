# Multi-stage Docker build for production
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build client
WORKDIR /app/client
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install PM2 globally
RUN npm install -g pm2

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built client and server code
COPY --from=builder /app/client/build ./client/build
COPY --from=builder /app/server ./server

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node server/healthcheck.js

# Start the application
CMD ["pm2-runtime", "start", "server/ecosystem.config.js"]
