# Deploying Muscle AI to Vercel

This guide outlines the steps to deploy your Muscle AI application to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup) (free tier is sufficient)
2. Your project pushed to a GitHub, GitLab, or Bitbucket repository
3. Your Together AI API key
4. Your Auth0 application credentials

## Deployment Steps

### 1. Prepare Your Repository

Make sure your code is up-to-date in your Git repository.

### 2. Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" > "Project"
3. Import your repository from GitHub, GitLab, or Bitbucket
4. Select the repository containing your Muscle AI project

### 3. Configure Project Settings

Once you've imported your repository, you'll need to configure a few settings:

1. **Framework Preset**: Verify that "Next.js" is selected
2. **Environment Variables**: Add the following environment variables:

   - `TOGETHER_API_KEY` - Your Together AI API key
   - `NEXT_PUBLIC_AUTH0_DOMAIN` - Your Auth0 domain
   - `NEXT_PUBLIC_AUTH0_CLIENT_ID` - Your Auth0 client ID

3. **Build and Output Settings**: These should be detected automatically from your vercel.json file

### 4. Configure Auth0

1. Log in to your [Auth0 Dashboard](https://manage.auth0.com/)
2. Go to your application settings
3. Add your Vercel deployment URL to the "Allowed Callback URLs":
   - `https://your-project-name.vercel.app/callback`
4. Add your Vercel deployment URL to the "Allowed Logout URLs":
   - `https://your-project-name.vercel.app`
5. Add your Vercel deployment URL to the "Allowed Web Origins":
   - `https://your-project-name.vercel.app`

### 5. Deploy

1. Click "Deploy" in the Vercel interface
2. Wait for the build and deployment to complete
3. Once deployed, Vercel will provide you with a URL for your application

## Post-Deployment

After successful deployment, test your application to ensure:

1. The login/authentication flow works correctly
2. Image uploads and analysis function as expected
3. The terms and privacy pages load correctly

## Troubleshooting

If you encounter issues:

1. Check the build logs in the Vercel dashboard
2. Verify that all environment variables are set correctly
3. Ensure your Auth0 settings include the correct callback and origin URLs
4. Check that your Together AI API key has sufficient credits/permissions

## Custom Domain (Optional)

To use a custom domain:

1. In the Vercel dashboard, go to your project settings
2. Click on "Domains"
3. Add your custom domain and follow the verification steps

## Automatic Deployments

By default, Vercel will automatically deploy updates when you push changes to your repository's main branch.

1. To disable this, go to your project settings and turn off "Git Integration"
2. To customize this behavior, set up specific branch deployment rules in the "Git Integration" settings
