#!/bin/bash

echo "🚀 Deploying Telangana Tourism with Custom Domain"

# Check if user has domain
read -p "Enter your custom domain (e.g., mytourism.com): " DOMAIN

if [ -z "$DOMAIN" ]; then
    echo "❌ No domain provided. Exiting."
    exit 1
fi

echo "📋 Deployment Options:"
echo "1. Vercel + Railway (Recommended)"
echo "2. Netlify + Railway"
echo "3. DigitalOcean App Platform"
echo "4. Manual VPS Deployment"

read -p "Choose option (1-4): " OPTION

case $OPTION in
    1)
        echo "🔧 Setting up Vercel + Railway deployment..."
        
        # Update vercel.json with domain
        sed -i "s/your-railway-backend.railway.app/your-backend-url/g" vercel.json
        
        echo "✅ Configuration updated for domain: $DOMAIN"
        echo "📝 Next steps:"
        echo "1. Push code to GitHub"
        echo "2. Connect to Vercel: https://vercel.com"
        echo "3. Deploy backend to Railway: https://railway.app"
        echo "4. Add domain in Vercel dashboard"
        ;;
    2)
        echo "🔧 Setting up Netlify + Railway deployment..."
        
        # Update netlify.toml with domain
        sed -i "s/your-railway-backend.railway.app/your-backend-url/g" netlify.toml
        
        echo "✅ Configuration updated for domain: $DOMAIN"
        echo "📝 Next steps:"
        echo "1. Push code to GitHub"
        echo "2. Connect to Netlify: https://netlify.com"
        echo "3. Deploy backend to Railway: https://railway.app"
        echo "4. Add domain in Netlify dashboard"
        ;;
    3)
        echo "🔧 Setting up DigitalOcean deployment..."
        
        # Update .do/app.yaml with domain
        sed -i "s/your-backend-url.com/$DOMAIN/g" .do/app.yaml
        
        echo "✅ Configuration updated for domain: $DOMAIN"
        echo "📝 Next steps:"
        echo "1. Push code to GitHub"
        echo "2. Create DigitalOcean App: https://cloud.digitalocean.com/apps"
        echo "3. Connect GitHub repository"
        echo "4. Add domain in App Platform"
        ;;
    4)
        echo "🔧 Manual VPS deployment instructions..."
        echo "📝 See DEPLOYMENT.md for detailed VPS setup"
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo "🎉 Deployment configuration complete!"
echo "🌐 Your website will be available at: https://$DOMAIN"

