#!/bin/bash

# Configuration
IMAGE_NAME="migration-tracker"
CONTAINER_NAME="migration-tracker-app"
PORT=3000

echo "Building Docker image..."
docker build -t $IMAGE_NAME .

if [ $? -ne 0 ]; then
    echo "Error: Docker build failed"
    exit 1
fi

echo "Stopping and removing existing container (if any)..."
docker stop $CONTAINER_NAME 2>/dev/null
docker rm $CONTAINER_NAME 2>/dev/null

echo "Running container..."
docker run -d \
    --name $CONTAINER_NAME \
    -p $PORT:80 \
    $IMAGE_NAME

if [ $? -eq 0 ]; then
    echo "Success! Application is running at http://localhost:$PORT"
    echo ""
    echo "Useful commands:"
    echo "  View logs:    docker logs $CONTAINER_NAME"
    echo "  Stop:         docker stop $CONTAINER_NAME"
    echo "  Start:        docker start $CONTAINER_NAME"
    echo "  Remove:       docker rm -f $CONTAINER_NAME"
else
    echo "Error: Failed to start container"
    exit 1
fi
