#!/bin/bash

echo "🚀 Pamoja V2 - Vercel Deployment"
echo "=================================="
echo ""

# Check if authenticated
if ! npx vercel whoami &>/dev/null; then
    echo "❌ Not authenticated with Vercel"
    echo ""
    echo "Please run: npx vercel login"
    echo "Or visit: https://vercel.com/account/tokens to get a token"
    echo ""
    echo "Then run this script again, or use:"
    echo "  npx vercel --prod --token YOUR_TOKEN"
    exit 1
fi

echo "✅ Authenticated with Vercel"
echo ""

# Get current user
USER=$(npx vercel whoami 2>/dev/null)
echo "Deploying as: $USER"
echo ""

# Deploy to production
echo "📦 Deploying to production..."
echo ""

npx vercel --prod --yes

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Your site should be live at the URL shown above."


