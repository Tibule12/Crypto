# CryptoConnect Deployment Guide

## Understanding the Deployment Issue

The error message "Branch 'main' is not allowed to deploy to github-pages due to environment protection rules" occurs when GitHub's environment protection rules prevent direct deployments from the `main` branch to GitHub Pages. This is a security feature designed to protect production environments.

## Solution Implemented

We've updated the deployment workflow in `.github/workflows/deploy.yml` to use the `peaceiris/actions-gh-pages@v3` action instead of the built-in GitHub Pages deployment action. This approach:

1. Builds the React frontend application on pushes to the `main` branch
2. Deploys the built files to the `gh-pages` branch
3. Bypasses the environment protection rules that were blocking deployment

## How the New Deployment Process Works

1. **Trigger**: The workflow runs automatically on pushes to the `main` branch or can be manually triggered via the GitHub Actions interface
2. **Build**: The React frontend is built using `npm run build`
3. **Deploy**: The built files are deployed to the `gh-pages` branch using the peaceiris GitHub Pages action
4. **Access**: The deployed site is accessible at `https://[username].github.io/Crypto/`

## Manual Deployment Trigger

In addition to automatic deployment on pushes to `main`, you can also manually trigger the deployment:

1. Go to the **Actions** tab in your GitHub repository
2. Select the **Deploy to GitHub Pages** workflow
3. Click **Run workflow** and select the `main` branch
4. Click **Run workflow** to start the deployment

## Troubleshooting

### If Deployment Still Fails

1. **Check Repository Settings**:
   - Go to **Settings** > **Pages**
   - Ensure the source is set to "Deploy from a branch"
   - Select "gh-pages" as the branch and "/ (root)" as the folder

2. **Verify GitHub Pages Configuration**:
   - Make sure your repository name is correctly set in the GitHub Pages URL
   - The site should be accessible at `https://[username].github.io/Crypto/`

3. **Check Workflow Permissions**:
   - Go to **Settings** > **Actions** > **General**
   - Under "Workflow permissions", ensure "Read and write permissions" is selected

### Environment Protection Rules

If you prefer to use the original GitHub Pages deployment approach with environment protection:

1. Go to **Settings** > **Environments**
2. Create or edit the `github-pages` environment
3. In the "Deployment branches" section, add `main` to the allowed branches
4. Save the changes

## Additional Notes

- The deployment process now adds a `.nojekyll` file to the build directory to prevent GitHub Pages from treating the site as a Jekyll site
- The workflow includes a manual trigger option for additional flexibility
- All deployment artifacts are stored in the `frontend/build` directory before deployment
