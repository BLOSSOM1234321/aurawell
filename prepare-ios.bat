@echo off
echo ================================================
echo  AuraWell iOS App Store Preparation Script
echo ================================================
echo.

echo Step 1: Installing dependencies...
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)
echo ✓ Dependencies installed
echo.

echo Step 2: Building production React app...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)
echo ✓ Production build complete
echo.

echo Step 3: Syncing Capacitor iOS project...
call npx cap sync ios
if %errorlevel% neq 0 (
    echo ERROR: Capacitor sync failed
    pause
    exit /b 1
)
echo ✓ Capacitor iOS synced
echo.

echo ================================================
echo  ✓ Windows preparation complete!
echo ================================================
echo.
echo Next steps (REQUIRES MAC):
echo 1. Transfer this entire folder to a Mac
echo 2. Install Xcode from Mac App Store
echo 3. Run: npx cap open ios
echo 4. Follow IOS_APP_STORE_GUIDE.md
echo.
echo See IOS_APP_STORE_GUIDE.md for complete instructions
echo.
pause