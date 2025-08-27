@echo off
echo 🚀 Starting CryptoConnect deployment...

echo 📦 Building frontend...
cd frontend
call npm install
call npm run build

echo 📁 Preparing deployment files...
cd ..
if exist deploy rmdir /s /q deploy
mkdir deploy
xcopy /e /i frontend\build\* deploy\

echo 🌿 Switching to gh-pages branch...
git checkout gh-pages

echo 🧹 Cleaning existing files...
git rm -rf .
git clean -fxd

echo 📁 Copying built files...
xcopy /e /i deploy\* .
rmdir /s /q deploy

echo 📝 Committing changes...
git add .
git commit -m "Deploy CryptoConnect frontend %date% %time%"
git push origin gh-pages

echo ↩️ Switching back to main branch...
git checkout main

echo ✅ Deployment complete! Visit: https://tibule12.github.io/Crypto/
pause
