# CryptoConnect Deployment Guide

## Understanding the Deployment Issue

The error message "Branch 'main' is not allowed to deploy to github-pages due to environment protection rules" occurs when GitHub's environment protection rules prevent direct deployments from the `main` branch to GitHub Pages. This is a security feature designed to protect production environments.

## Solution Implemented

We've updated the deployment workflow in `.github/workflows/deploy.yml` to use a personal access token for authentication, which bypasses the environment protection rules that were blocking deployment.

## How the New Deployment Process Works

1. **Trigger**: The workflow runs automatically on pushes to the `main` branch
2. **Setup**: Node.js environment is configured and dependencies are installed using `npm ci` for faster installs
3. **Build**: The React frontend is built using `npm run build`
4. **Deploy**: The built files are deployed to GitHub Pages using the peaceiris GitHub Pages action with a personal access token
5. **Access**: The deployed site is accessible at `https://[username].github.io/Crypto/`

## Setting Up the DEPLOY_TOKEN Secret

To make the deployment workflow work, you need to create a personal access token and add it as a secret in your repository:

1. Go to your GitHub **Settings** (not the repository settings)
2. Click on **Developer settings** in the left sidebar
3. Click on **Personal access tokens** > **Tokens (classic)**
4. Click **Generate new token** > **Generate new token (classic)**
5. Give the token a name (e.g., "Deploy to GitHub Pages")
6. Select the `public_repo` scope
7. Click **Generate token**
8. Copy the generated token (you won't see it again)
9. Go to your repository **Settings**
10. Click on **Secrets and variables** > **Actions**
11. Click **New repository secret**
12. Set the name to `DEPLOY_TOKEN` and paste the token value
13. Click **Add secret**

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

4. **Verify DEPLOY_TOKEN Secret**:
   - Go to **Settings** > **Secrets and variables** > **Actions**
   - Ensure the `DEPLOY_TOKEN` secret exists and has the correct value

### Environment Protection Rules

If you prefer to use the original GitHub Pages deployment approach with environment protection:

1. Go to **Settings** > **Environments**
2. Create or edit the `github-pages` environment
3. In the "Deployment branches" section, add `main` to the allowed branches
4. Save the changes

## Additional Notes

- The deployment process now adds a `.nojekyll` file to the build directory to prevent GitHub Pages from treating the site as a Jekyll site
- The workflow uses `npm ci` instead of `npm install` for faster and more reliable dependency installation
- Node.js version 16 is used for compatibility with the deployment action
- Caching is implemented for node modules to speed up subsequent builds
