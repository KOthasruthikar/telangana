@echo off
echo 🚀 Setting up Telangana Tourism Website...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js (v14 or higher) first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install root dependencies
echo 📦 Installing root dependencies...
npm install

REM Install server dependencies
echo 📦 Installing server dependencies...
cd server
npm install

REM Install client dependencies
echo 📦 Installing client dependencies...
cd ..\client
npm install

REM Go back to root
cd ..

echo ✅ All dependencies installed successfully!

REM Create .env file if it doesn't exist
if not exist "server\.env" (
    echo 📝 Creating .env file...
    (
        echo PORT=5000
        echo MONGODB_URI=mongodb://localhost:27017/telangana-tourism
        echo JWT_SECRET=your_jwt_secret_key_here_change_this_in_production
        echo CLIENT_URL=http://localhost:3000
        echo.
        echo # Email configuration (optional^)
        echo EMAIL_HOST=smtp.gmail.com
        echo EMAIL_PORT=587
        echo EMAIL_USER=your_email@gmail.com
        echo EMAIL_PASS=your_app_password
        echo.
        echo # Google Maps API (optional^)
        echo GOOGLE_MAPS_API_KEY=your_google_maps_api_key
        echo.
        echo # Admin credentials
        echo ADMIN_EMAIL=admin@telanganatourism.com
        echo ADMIN_PASSWORD=admin123
    ) > server\.env
    echo ✅ .env file created. Please update it with your configuration.
) else (
    echo ✅ .env file already exists
)

echo.
echo 🎉 Installation completed successfully!
echo.
echo 📋 Next steps:
echo 1. Make sure MongoDB is running on your system
echo 2. Update server\.env with your configuration
echo 3. Run 'npm run seed' to populate the database with sample data
echo 4. Run 'npm run dev' to start the development server
echo.
echo 🌐 The application will be available at:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:5000
echo.
echo 👤 Default admin credentials:
echo    Email: admin@telanganatourism.com
echo    Password: admin123
echo.
echo Happy coding! 🚀
pause
