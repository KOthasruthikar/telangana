@echo off
echo 🚀 Deploying Telangana Tourism Website Fixes...
echo.

echo 📦 Adding all changes to Git...
git add .

echo 💾 Committing changes...
git commit -m "Fix Docker build issues - react-scripts not found"

echo 🚀 Pushing to GitHub...
git push

echo.
echo ✅ Fixes deployed! Railway will automatically redeploy.
echo.
echo 📋 What was fixed:
echo   - Fixed react-scripts not found error
echo   - Updated Dockerfile.railway to install all client dependencies
echo   - Improved build process for Railway deployment
echo.
echo 🎉 Your website should build successfully now!
pause
