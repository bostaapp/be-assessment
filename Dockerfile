# Use the official Node.js image as the base
FROM node:14.17.5-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm i

# Copy the rest of the application code
COPY . .

# Build the TypeScript project
RUN npm run build

# Expose the port
EXPOSE 4000
