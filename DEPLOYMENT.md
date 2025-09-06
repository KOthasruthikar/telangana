# 🚀 Telangana Tourism - Production Deployment Guide

## Quick Start (5 Minutes)

### Option 1: Docker Deployment (Recommended)
```bash
# 1. Clone and navigate to project
git clone <your-repo>
cd telangana-tourism

# 2. Run deployment script
# On Linux/Mac:
chmod +x deploy.sh && ./deploy.sh

# On Windows:
deploy.bat

# 3. Access your website
# http://localhost (Frontend)
# http://localhost/api (Backend API)
```

### Option 2: Manual Deployment
```bash
# 1. Install dependencies
npm run install-all

# 2. Build for production
npm run build

# 3. Start production server
npm run production
```

## 🌐 Production URLs
- **Website**: `http://your-domain.com`
- **API**: `http://your-domain.com/api`
- **Health Check**: `http://your-domain.com/health`

## 📧 Email Configuration
Reviews are automatically sent to: `kothasruthikarreddy11@gmail.com`

## 🔧 Environment Variables
Create `server/.env` with:
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://sruthikarreddy08:Sruthikar%4011@cluster0.pde0amz.mongodb.net/telangana-tourism-prod
JWT_SECRET=your_super_secure_jwt_secret_key_for_production_2024
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
ADMIN_EMAIL=kothasruthikarreddy11@gmail.com
```

## 🐳 Docker Commands
```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild
docker-compose build --no-cache
```

## 📊 Database
- **MongoDB Atlas**: Production database
- **Local MongoDB**: For development
- **Auto-seeding**: Sample data included

## 🔒 Security Features
- JWT Authentication
- Rate Limiting
- CORS Protection
- Input Validation
- SQL Injection Prevention
- XSS Protection

## 📱 Features Included
- ✅ User Authentication
- ✅ Places & Festivals Management
- ✅ Review System with Email Notifications
- ✅ Interactive Maps with Directions
- ✅ Distance Calculation
- ✅ Responsive Design
- ✅ Admin Dashboard
- ✅ Image Upload
- ✅ Search & Filtering

## 🚀 Deployment Platforms
- **VPS/Cloud**: Use Docker deployment
- **Heroku**: Use manual deployment
- **AWS**: Use Docker on EC2
- **DigitalOcean**: Use Docker on Droplet
- **Vercel**: Frontend only (separate backend)

## 📞 Support
For issues or questions, contact: kothasruthikarreddy11@gmail.com
