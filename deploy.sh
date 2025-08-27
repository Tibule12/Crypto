#!/bin/bash

# CryptoConnect Deployment Script
# This script builds the frontend and deploys to GitHub Pages

echo "🚀 Starting CryptoConnect deployment..."

# Build the frontend
echo "📦 Building frontend..."
cd frontend
npm install
npm run build

# Create a temporary directory for deployment
cd ..
rm -rf deploy
mkdir deploy
cp -r frontend/build/* deploy/

# Switch to gh-pages branch
echo "🌿 Switching to gh-pages branch..."
git checkout gh-pages

# Remove existing files except .git
echo "🧹 Cleaning existing files..."
git rm -rf .
git clean -fxd

# Copy built files
echo "📁 Copying built files..."
cp -r deploy/* .
rm -rf deploy

# Commit and push to gh-pages
echo "📝 Committing changes..."
git add .
git commit -m "Deploy CryptoConnect frontend $(date '+%Y-%m-%d %H:%M:%S')"
git push origin gh-pages

# Switch back to main branch
echo "↩️ Switching back to main branch..."
git checkout main

echo "✅ Deployment complete! Visit: https://tibule12.github.io/Crypto/"
