FROM node:22-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies (frozen lockfile for consistency)
RUN pnpm install --frozen-lockfile

# Copy source code (optional, as we will bind mount in compose)
COPY . .

# Expose Next.js port
EXPOSE 3000

# Start development server
CMD ["pnpm", "dev"]
