# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set environment variables for increased timeouts and memory allocation
ENV NODE_TIMEOUT=600000
ENV NODE_OPTIONS="--max-old-space-size=2048"
ENV DOCKER_BUILDKIT=1
ENV COMPOSE_DOCKER_CLI_EXPERIMENTAL=enabled

# Set the working directory in the container
WORKDIR /app

# Install dependencies with the 'omit dev' flag for production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Increase npm timeout settings to avoid timeouts
RUN npm config set fetch-timeout 600000
RUN npm config set connect-timeout 600000

# Copy the rest of the application code
COPY . .

# Build the application for production
RUN npm run build

# Expose the port that the app will run on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
