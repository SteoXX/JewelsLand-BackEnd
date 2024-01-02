# Use an official Node.js runtime as the base image
FROM node:20.10.0

# Set the working directory in the container to /app
WORKDIR ./

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Create a new directory named 'cert'
RUN mkdir cert

# Copy cert.pem and key.pem from your 'cert' directory into the 'cert' directory in the container
COPY cert/cert.pem cert/
COPY cert/key.pem cert/

# Copy the rest of the application code to the working directory
COPY . .

# Make port 443 available outside the container
EXPOSE 443

# Define the command to run the application
CMD [ "node", "." ]
