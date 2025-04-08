# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy the rest of the application code
COPY . .

# Build the application for production
RUN npm run build

# Expose the port that the app will run on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
