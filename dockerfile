# Use official Node.js image
FROM node:22.2.0

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the application
COPY . .

# Set environment variables (can be overridden in docker-compose)
ENV NODE_ENV=production

# Expose port (should match your app's port)
EXPOSE 8080

# Start the app
CMD ["node", "app.js"]
