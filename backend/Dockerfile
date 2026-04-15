# Stage 1: Build React app
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files (you need these!)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve with Node/Express
FROM node:18-alpine

WORKDIR /app

# Install a simple HTTP server
RUN npm install -g serve

# Copy built app from builder stage
COPY --from=builder /app/build ./build

# Expose port
EXPOSE 3000

# Start the app
CMD ["serve", "-s", "build", "-l", "3000"]