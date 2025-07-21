FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies if needed
RUN apk add --no-cache curl

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy source code
COPY src/ ./src/

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:3001/health || exit 1

# Start the application
CMD ["node", "src/server.js"] 