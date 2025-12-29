# Mac Setup Guide for AuraWell iOS App

## 🎉 You Have a Mac - Let's Build Your App!

Follow these steps **in order** on your Mac.

---

## Step 1: Transfer Project to Mac

### Option A: USB Drive (Easiest)
1. **On Windows**: Copy the entire folder to a USB drive
   - Folder: `C:\Users\Bloss\PycharmProjects\PythonProject\aura-well-copy-1b2413a7`
2. **Plug USB into Mac**
3. **Copy folder** to Mac Desktop or Documents

### Option B: Cloud Storage
1. Upload folder to Google Drive, Dropbox, or OneDrive
2. Download on Mac
3. Extract to Desktop or Documents

### Option C: Git (If you use GitHub)
1. On Windows:
   ```bash
   cd C:\Users\Bloss\PycharmProjects\PythonProject\aura-well-copy-1b2413a7
   git init
   git add .
   git commit -m "iOS build preparation"
   git push
   ```
2. On Mac:
   ```bash
   git clone [your-repo-url]
   ```

**✅ Checkpoint**: Folder is now on your Mac

---

## Step 2: Install Xcode (Required)

1. **Open App Store** on Mac
2. **Search**: "Xcode"
3. **Click**: "Get" or "Install" (it's FREE)
4. **Wait**: 20-60 minutes (it's ~12GB)
5. **Open Xcode** once installed
6. **Accept** license agreement
7. **Wait** for "Installing components..."

**✅ Checkpoint**: Xcode is installed and opened at least once

---

## Step 3: Install Command Line Tools

Open **Terminal** on Mac (Spotlight search: "Terminal")

```bash
xcode-select --install
```

Click "Install" when prompted.

**✅ Checkpoint**: Command line tools installed

---

## Step 4: Install Homebrew (Mac Package Manager)

In Terminal:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Follow the prompts. When done, run:

```bash
brew --version
```

Should show version number.

**✅ Checkpoint**: Homebrew installed

---

## Step 5: Install Node.js

In Terminal:

```bash
brew install node
```

Verify:

```bash
node --version
npm --version
```

**✅ Checkpoint**: Node.js installed

---

## Step 6: Install CocoaPods (iOS Dependency Manager)

In Terminal:

```bash
sudo gem install cocoapods
```

Enter your Mac password when prompted.

Verify:

```bash
pod --version
```

**✅ Checkpoint**: CocoaPods installed

---

## Step 7: Navigate to Your Project

In Terminal, navigate to where you copied the project:

```bash
cd ~/Desktop/aura-well-copy-1b2413a7
```

Or if in Documents:

```bash
cd ~/Documents/aura-well-copy-1b2413a7
```

**Tip**: You can drag the folder from Finder into Terminal to auto-fill the path!

**✅ Checkpoint**: You're in the project folder

---

## Step 8: Install Node Dependencies

In Terminal (make sure you're in the project folder):

```bash
npm install --legacy-peer-deps
```

**✅ Checkpoint**: Dependencies installed

---

## Step 9: Install iOS Pods

In Terminal:

```bash
cd ios/App
pod install
```

You should see:

```
Pod installation complete! There are X dependencies...
```

Go back to project root:

```bash
cd ../..
```

**✅ Checkpoint**: iOS pods installed

---

## Step 10: Open Project in Xcode

In Terminal (from project root):

```bash
npx cap open ios
```

This should open Xcode with your project.

**⚠️ CRITICAL**: Xcode should open `App.xcworkspace` (NOT `App.xcodeproj`)

**✅ Checkpoint**: Project is open in Xcode

---

## Step 11: Configure Project in Xcode

### 11.1 Select the App Target

In Xcode's left sidebar (Navigator):
1. Click the blue **App** icon at the top
2. In the main panel, make sure **App** is selected under TARGETS

### 11.2 General Tab

Set these values:

- **Display Name**: AuraWell
- **Bundle Identifier**: com.aurawell.app
  - ⚠️ If this is taken, use: com.yourname.aurawell
- **Version**: 1.0.0
- **Build**: 1
- **Deployment Target**: 15.0 (or higher)

### 11.3 Signing & Capabilities Tab

1. **Check**: "Automatically manage signing"
2. **Team**: Select your Apple Developer account
   - If you don't see it, click "Add Account..."
   - Sign in with your Apple ID
   - Must have paid $99 for Apple Developer Program

**If you see errors:**
- Make sure Bundle ID is unique
- Make sure you're enrolled in Apple Developer Program
- Try clicking "Try Again"

**✅ Checkpoint**: No signing errors

---

## Step 12: Test Build in Simulator

1. At the top of Xcode, click the device selector
2. Choose **iPhone 15 Pro** (or any simulator)
3. Click the **Play** button (▶️) or press Cmd+R
4. **Wait** for build (first build takes 3-5 minutes)
5. **Simulator should open** with your app

**If app crashes:**
- Check Console (bottom panel) for errors
- Most common: Missing permissions in Info.plist

**✅ Checkpoint**: App runs in simulator

---

## Step 13: Test on Real iPhone (Optional but Recommended)

1. **Connect iPhone** to Mac via USB
2. **Trust this computer** on iPhone
3. In Xcode, select your **iPhone** from device selector
4. Click **Play** (▶️)
5. On iPhone, go to **Settings → General → VPN & Device Management**
6. **Trust** your developer certificate
7. App should launch

**✅ Checkpoint**: App runs on real device

---

## Step 14: Archive for App Store

### Before Archiving:

1. **Select**: "Any iOS Device (arm64)" as destination
   - NOT a simulator
   - NOT a specific device
2. **Check**: Product → Scheme → Edit Scheme → Run → Build Configuration is "Release"

### Archive:

1. **Product** → **Archive**
2. **Wait** 5-10 minutes for archive to build
3. When done, **Organizer** window opens

**✅ Checkpoint**: Archive created successfully

---

## Step 15: Upload to App Store Connect

In Organizer:

1. Select your archive
2. Click **Distribute App**
3. Choose **App Store Connect**
4. Click **Upload**
5. **Signing**: Choose "Automatically manage signing"
6. Click **Upload**
7. **Wait** 10-30 minutes for upload

**✅ Checkpoint**: App uploaded to App Store Connect

---

## Step 16: Create App in App Store Connect

1. Go to: [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. **My Apps** → **+** → **New App**
3. Fill in:
   - **Platform**: iOS
   - **Name**: AuraWell
   - **Primary Language**: English
   - **Bundle ID**: com.aurawell.app (select from dropdown)
   - **SKU**: aurawell-001
   - **User Access**: Full Access
4. Click **Create**

**✅ Checkpoint**: App created in App Store Connect

---

## Step 17: Prepare App Store Listing

### Required Items:

#### Screenshots (Use Simulator)

1. In Xcode, run app in these simulators:
   - iPhone 15 Pro Max (6.7")
   - iPhone 14 Pro Max (6.5")
   - iPad Pro 12.9"
2. For each: Cmd+S to save screenshot
3. Screenshots save to Desktop
4. Need at least 1 for each size

#### App Information

Fill in App Store Connect:

- **Name**: AuraWell
- **Subtitle**: Mental Health & Wellness (30 chars max)
- **Description**: Write a compelling description
- **Keywords**: mental health, wellness, meditation, mood tracker
- **Support URL**: Your website
- **Privacy Policy URL**: **REQUIRED** - Use template provided

#### Age Rating

Answer the questionnaire (likely 12+ or 17+ due to mental health content)

---

## Step 18: Wait for Processing

After upload:

1. Go to **App Store Connect** → **Your App** → **TestFlight**
2. Wait for "Processing" to complete (10-60 minutes)
3. Status will change to "Ready to Submit"

**✅ Checkpoint**: Build is ready

---

## Step 19: Submit for Review

1. In App Store Connect, go to **App Store** tab
2. Click **+ Version** or select version 1.0
3. Fill in all required information
4. Select your build
5. Click **Submit for Review**

**Review time**: 24-48 hours for first submission

---

## Common Issues & Solutions

### "No signing identity found"
**Fix**: Enable "Automatically manage signing" in Signing & Capabilities

### "Missing compliance"
**Fix**: In App Store Connect, answer export compliance questions
- Does your app use encryption? Yes (HTTPS)
- Choose: "Uses only standard encryption"

### Build fails with Pod errors
**Fix**:
```bash
cd ios/App
pod deintegrate
pod install
```

### Simulator won't launch
**Fix**: Restart Xcode or restart Mac

### Upload stuck at "Uploading..."
**Fix**: Check internet connection, wait longer (can take 30+ minutes)

---

## Helpful Commands

```bash
# Build web app
npm run build

# Sync to iOS
npx cap sync ios

# Open in Xcode
npx cap open ios

# Update Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/ios --legacy-peer-deps
npx cap sync ios
```

---

## Terminal Shortcuts on Mac

- **Cmd + Space**: Open Spotlight (search for Terminal)
- **Cmd + C**: Copy
- **Cmd + V**: Paste
- **Tab**: Auto-complete paths
- **Up Arrow**: Previous command
- **Cmd + K**: Clear terminal
- **Cmd + T**: New terminal tab

---

## Next Steps After This Guide

1. ✅ App builds in Xcode
2. ✅ Archived successfully
3. ✅ Uploaded to App Store Connect
4. ⏳ Waiting for review
5. 🎉 App goes live!

---

## Help & Resources

**Apple:**
- [Xcode Help](https://developer.apple.com/xcode/)
- [App Store Connect](https://appstoreconnect.apple.com)

**Capacitor:**
- [iOS Documentation](https://capacitorjs.com/docs/ios)

**Questions?**
- Check `IOS_APP_STORE_GUIDE.md`
- Check `APP_STORE_CHECKLIST.md`

---

Good luck! You're almost there! 🚀