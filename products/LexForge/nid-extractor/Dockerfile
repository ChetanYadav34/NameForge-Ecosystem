FROM node:20-slim

# Install sqlite3 dependencies for building native addons
RUN apt-get update && apt-get install -y python3 make g++ sqlite3 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Set up the data directory
RUN mkdir -p /app/data

# Environment variables
ENV PORT=4000
ENV NODE_ENV=production

EXPOSE 4000

# Start the server
CMD ["npm", "start"]
