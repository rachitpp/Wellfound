#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "Installing dependencies..."
npm install

echo "Creating .env file from environment variables..."
# Create .env file from environment variables if they exist
if [ ! -f .env ]; then
  touch .env
  if [ -n "$MONGODB_URI" ]; then echo "MONGODB_URI=$MONGODB_URI" >> .env; fi
  if [ -n "$JWT_SECRET" ]; then echo "JWT_SECRET=$JWT_SECRET" >> .env; fi
  if [ -n "$COHERE_API_KEY" ]; then echo "COHERE_API_KEY=$COHERE_API_KEY" >> .env; fi
  if [ -n "$FRONTEND_URL" ]; then echo "FRONTEND_URL=$FRONTEND_URL" >> .env; fi
  echo "Created .env file"
fi

echo "Building project..."
npm run build

echo "Build completed successfully!"