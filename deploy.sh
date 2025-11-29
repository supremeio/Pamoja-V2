#!/bin/bash
echo "Starting Vercel deployment..."
echo ""
echo "If you're not logged in, you'll be prompted to authenticate."
echo "This will open your browser for authentication."
echo ""
npx vercel --prod
