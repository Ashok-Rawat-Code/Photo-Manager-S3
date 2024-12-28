FROM node:18-alpine

WORKDIR /app

# Install dependencies only when needed
COPY package*.json ./
RUN npm ci

# Copy project files
COPY . .

# Build the app
RUN npm run build

# Expose port 5173
EXPOSE 5173

# Start the app in production mode
CMD ["npm", "run", "preview"]