# Use Node.js environment
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies (use --legacy-peer-deps if needed)
RUN npm install --legacy-peer-deps

# Copy the rest of the code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the app
CMD ["npm", "start"]