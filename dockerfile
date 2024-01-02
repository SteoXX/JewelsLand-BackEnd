# Use an official Node.js runtime as the base image
FROM node:20.10.0

# Create app directory in the container
RUN mkdir -p /app

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Make port 443 available outside the container
EXPOSE 443

# Define the command to run the application
CMD [ "node", "." ]
