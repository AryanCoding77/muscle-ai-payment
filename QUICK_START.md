# Quick Start Guide: Deploying to Vercel

This guide provides step-by-step instructions to deploy Muscle AI to Vercel in minutes.

## Step 1: Push your code to GitHub

Ensure your code is in a GitHub repository:

```bash
# Initialize repo (if not done already)
git init

# Add all files to git
git add .

# Commit changes
git commit -m "Initial commit"

# Add your GitHub repository as a remote
git remote add origin https://github.com/YOUR_USERNAME/muscle-ai.git

# Push code to GitHub
git push -u origin main
```

## Step 2: Deploy to Vercel

1. Go to [Vercel](https://vercel.com/) and sign up/sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Next.js (should be detected automatically)
   - Root Directory: ./

## Step 3: Configure Environment Variables

1. In the Vercel project settings, add the following Environment Variables:

   - `TOGETHER_API_KEY` = your Together AI API key
   - `NEXT_PUBLIC_AUTH0_DOMAIN` = your Auth0 domain
   - `NEXT_PUBLIC_AUTH0_CLIENT_ID` = your Auth0 client ID

2. Click "Deploy"

## Step 4: Update Auth0 Configuration

1. Once deployed, copy your Vercel deployment URL (e.g., https://muscle-ai.vercel.app)
2. Go to your Auth0 dashboard and update your application settings:
   - Allowed Callback URLs: add `https://your-vercel-url/callback`
   - Allowed Logout URLs: add `https://your-vercel-url`
   - Allowed Web Origins: add `https://your-vercel-url`

## Step 5: Test Your Deployment

1. Visit your Vercel deployment URL
2. Test the authentication flow
3. Test image upload and analysis functionality

## Troubleshooting

If you encounter any issues:

1. Check Vercel deployment logs for errors
2. Verify environment variables are correctly set
3. Ensure Auth0 settings match your Vercel URL
4. Confirm your Together AI key is active and has sufficient credits

That's it! Your Muscle AI application should now be live and accessible to users.
