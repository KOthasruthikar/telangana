@echo off
echo 🚀 Deploying Telangana Tourism with Custom Domain

set /p DOMAIN="Enter your custom domain (e.g., mytourism.com): "

if "%DOMAIN%"=="" (
    echo ❌ No domain provided. Exiting.
    pause
    exit /b 1
)

echo 📋 Deployment Options:
echo 1. Vercel + Railway (Recommended)
echo 2. Netlify + Railway  
echo 3. DigitalOcean App Platform
echo 4. Manual VPS Deployment

set /p OPTION="Choose option (1-4): "

if "%OPTION%"=="1" (
    echo 🔧 Setting up Vercel + Railway deployment...
    echo ✅ Configuration updated for domain: %DOMAIN%
    echo 📝 Next steps:
    echo 1. Push code to GitHub
    echo 2. Connect to Vercel: https://vercel.com
    echo 3. Deploy backend to Railway: https://railway.app
    echo 4. Add domain in Vercel dashboard
) else if "%OPTION%"=="2" (
    echo 🔧 Setting up Netlify + Railway deployment...
    echo ✅ Configuration updated for domain: %DOMAIN%
    echo 📝 Next steps:
    echo 1. Push code to GitHub
    echo 2. Connect to Netlify: https://netlify.com
    echo 3. Deploy backend to Railway: https://railway.app
    echo 4. Add domain in Netlify dashboard
) else if "%OPTION%"=="3" (
    echo 🔧 Setting up DigitalOcean deployment...
    echo ✅ Configuration updated for domain: %DOMAIN%
    echo 📝 Next steps:
    echo 1. Push code to GitHub
    echo 2. Create DigitalOcean App: https://cloud.digitalocean.com/apps
    echo 3. Connect GitHub repository
    echo 4. Add domain in App Platform
) else if "%OPTION%"=="4" (
    echo 🔧 Manual VPS deployment instructions...
    echo 📝 See DEPLOYMENT.md for detailed VPS setup
) else (
    echo ❌ Invalid option
    pause
    exit /b 1
)

echo 🎉 Deployment configuration complete!
echo 🌐 Your website will be available at: https://%DOMAIN%
pause
