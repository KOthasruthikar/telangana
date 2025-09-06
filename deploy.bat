@echo off
REM Telangana Tourism Deployment Script for Windows
echo 🚀 Starting Telangana Tourism Deployment...

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

REM Create necessary directories
echo [INFO] Creating necessary directories...
if not exist "server\logs" mkdir server\logs
if not exist "server\uploads" mkdir server\uploads
if not exist "ssl" mkdir ssl

REM Build and start services
echo [INFO] Building and starting services...
docker-compose down
docker-compose build --no-cache
docker-compose up -d

REM Wait for services to be ready
echo [INFO] Waiting for services to be ready...
timeout /t 30 /nobreak >nul

REM Check if services are running
docker-compose ps | findstr "Up" >nul
if %errorlevel% equ 0 (
    echo [INFO] ✅ Services are running successfully!
    echo [INFO] 🌐 Application is available at: http://localhost
    echo [INFO] 📊 API is available at: http://localhost/api
    echo [INFO] 📧 Reviews will be sent to: kothasruthikarreddy11@gmail.com
) else (
    echo [ERROR] ❌ Some services failed to start. Check logs with: docker-compose logs
    pause
    exit /b 1
)

REM Show running services
echo [INFO] Running services:
docker-compose ps

echo [INFO] 🎉 Deployment completed successfully!
echo [WARNING] Don't forget to:
echo [WARNING] 1. Update your domain name in nginx.conf
echo [WARNING] 2. Configure SSL certificates in ./ssl/ directory
echo [WARNING] 3. Set up proper email credentials in server/.env
echo [WARNING] 4. Change default passwords and secrets

pause
