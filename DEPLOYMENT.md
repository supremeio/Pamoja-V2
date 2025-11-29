# Deployment Guide

## Quick Deploy to Vercel (Recommended)

The easiest way to get your Pamoja V2 frontend live is using Vercel:

### Step 1: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click **"Add New Project"**
4. Select the **`Pamoja-V2`** repository
5. Vercel will automatically detect it's a Next.js project

### Step 2: Configure (Optional)

- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

### Step 3: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for the build to complete
3. Your site will be live at: `https://pamoja-v2-[your-username].vercel.app`

### Step 4: Custom Domain (Optional)

1. Go to your project settings on Vercel
2. Navigate to **"Domains"**
3. Add your custom domain

---

## Alternative: Deploy to GitHub Pages

If you prefer GitHub Pages:

1. Go to your repository: https://github.com/supremeio/Pamoja-V2
2. Click **Settings** → **Pages**
3. Under **Source**, select **"GitHub Actions"**
4. Create a workflow file manually or use the GitHub Pages deployment action

**Note**: Next.js apps on GitHub Pages require static export configuration. You may need to modify `next.config.js` to enable `output: 'export'`.

---

## Environment Variables

If your app needs environment variables:

1. Go to your Vercel project settings
2. Navigate to **"Environment Variables"**
3. Add your variables
4. Redeploy

---

## Automatic Deployments

Once connected to Vercel:
- Every push to `main` branch = automatic production deployment
- Every pull request = preview deployment

Your site will always be up-to-date! 🚀

