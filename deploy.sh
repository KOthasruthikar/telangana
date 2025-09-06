#!/bin/bash

# Telangana Tourism Deployment Script
echo "🚀 Starting Telangana Tourism Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p server/logs
mkdir -p server/uploads
mkdir -p ssl

# Set proper permissions
chmod 755 server/logs
chmod 755 server/uploads

# Build and start services
print_status "Building and starting services..."
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 30

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    print_status "✅ Services are running successfully!"
    print_status "🌐 Application is available at: http://localhost"
    print_status "📊 API is available at: http://localhost/api"
    print_status "📧 Reviews will be sent to: kothasruthikarreddy11@gmail.com"
else
    print_error "❌ Some services failed to start. Check logs with: docker-compose logs"
    exit 1
fi

# Show running services
print_status "Running services:"
docker-compose ps

print_status "🎉 Deployment completed successfully!"
print_warning "Don't forget to:"
print_warning "1. Update your domain name in nginx.conf"
print_warning "2. Configure SSL certificates in ./ssl/ directory"
print_warning "3. Set up proper email credentials in server/.env"
print_warning "4. Change default passwords and secrets"
