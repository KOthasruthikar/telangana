// Run this after getting your Railway backend URL
const fs = require('fs');

// Replace with your actual Railway URL
const RAILWAY_URL = 'https://your-backend-url.up.railway.app';

// Update vercel.json
const vercelConfig = {
  "version": 2,
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": `${RAILWAY_URL}/api/$1`
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
};

fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));

// Update client/vercel.json
const clientVercelConfig = {
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": `${RAILWAY_URL}/api/$1`
    }
  ]
};

fs.writeFileSync('client/vercel.json', JSON.stringify(clientVercelConfig, null, 2));

console.log('✅ Configuration updated with Railway URL:', RAILWAY_URL);
console.log('📝 Next: Push changes and redeploy to Vercel');
