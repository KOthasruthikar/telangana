#!/bin/bash

echo "🚀 Setting up Telangana Tourism Website..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v14 or higher) first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install

# Install client dependencies
echo "📦 Installing client dependencies..."
cd ../client
npm install

# Go back to root
cd ..

echo "✅ All dependencies installed successfully!"

# Create .env file if it doesn't exist
if [ ! -f "server/.env" ]; then
    echo "📝 Creating .env file..."
    cat > server/.env << EOL
PORT=5000
MONGODB_URI=mongodb://localhost:27017/telangana-tourism
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production
CLIENT_URL=http://localhost:3000

# Email configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Google Maps API (optional)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Admin credentials
ADMIN_EMAIL=admin@telanganatourism.com
ADMIN_PASSWORD=admin123
EOL
    echo "✅ .env file created. Please update it with your configuration."
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🎉 Installation completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Make sure MongoDB is running on your system"
echo "2. Update server/.env with your configuration"
echo "3. Run 'npm run seed' to populate the database with sample data"
echo "4. Run 'npm run dev' to start the development server"
echo ""
echo "🌐 The application will be available at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo ""
echo "👤 Default admin credentials:"
echo "   Email: admin@telanganatourism.com"
echo "   Password: admin123"
echo ""
echo "Happy coding! 🚀"
