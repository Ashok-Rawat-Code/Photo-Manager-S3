#!/bin/bash

# Exit on error
set -e

echo "🚀 Setting up AWS Photo Manager..."

# Create project directory if it doesn't exist
if [ ! -d "photo-manager" ]; then
  mkdir photo-manager
fi

# Copy all project files to the new directory
cp -r * photo-manager/ 2>/dev/null || true
cd photo-manager

# Initialize git and create .gitignore
echo "node_modules
dist
.env
.DS_Store
*.log" > .gitignore

# Create .env file with provided credentials
echo "Creating .env file with provided credentials..."
if [ -f ../.env ]; then
  cp ../.env .env
else
  cat > .env << EOL
VITE_AWS_ACCESS_KEY_ID=${1:-'your_access_key_id'}
VITE_AWS_SECRET_ACCESS_KEY=${2:-'your_secret_access_key'}
VITE_AWS_REGION=${3:-'your_region'}
VITE_AWS_BUCKET_NAME=${4:-'your_bucket_name'}
EOL
fi

# Check if Docker is installed and running
if command -v docker &> /dev/null && docker info &> /dev/null; then
  echo "🐳 Docker is installed and running, using Docker deployment..."
  
  # Build and run with Docker
  docker-compose up --build -d
  
  echo "✅ Docker deployment complete!"
  echo "Access the application at http://localhost:5173"
else
  echo "⚠️ Docker not found or not running, falling back to local deployment..."
  
  # Install dependencies
  echo "Installing dependencies..."
  npm install

  # Build the project
  echo "Building the project..."
  npm run build

  # Start the preview server
  echo "Starting the preview server..."
  npm run preview

  echo "✅ Setup complete!"
  echo "Access the application at http://localhost:5173"
fi