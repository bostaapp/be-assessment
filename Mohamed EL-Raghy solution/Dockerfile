# Base image
FROM node:14-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to working directory
COPY package*.json ./

# Install npm packages
RUN npm install

# Copy all other files to working directory
COPY . .

# Expose port 3000 (or whichever port your app uses)
EXPOSE 3000

# Start the app
CMD [ "npm", "start" ]