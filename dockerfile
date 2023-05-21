# Specify the base image
FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if present) to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the entire application to the working directory
COPY . .

# Expose the desired port (change it to match the port your application listens on)
EXPOSE 3000

# Define the command to run your application
CMD [ "npm", "run", "dev" ]