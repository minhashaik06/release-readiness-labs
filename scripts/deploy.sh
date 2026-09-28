#!/bin/bash

set -e

APP_PORT="${APP_PORT:-3001}"

echo "Starting deployment..."

echo "Building and starting production application..."
docker compose up -d --build

echo "Waiting for application to become healthy..."

for i in {1..30}; do
  if curl -fsS "http://localhost:${APP_PORT}/health" > /dev/null; then
    echo "Application health check passed."
    echo "Deployment successful."
    exit 0
  fi

  sleep 2
done

echo "Deployment failed: application did not become healthy."
docker compose logs
docker compose down
exit 1