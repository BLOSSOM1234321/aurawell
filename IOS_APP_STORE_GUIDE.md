# iOS App Store Submission Guide - AuraWell

## Prerequisites

### 1. Hardware & Software Requirements
- **Mac Computer** (Required - cannot build iOS apps on Windows)
- **Xcode 15+** (Download from Mac App Store)
- **macOS Ventura or later** (recommended)
- **Apple Developer Account** ($99/year)

### 2. Current Project Status
- ✅ Capacitor configured (v8.0.0)
- ✅ iOS project created at `ios/App`
- ✅ App ID: `com.aurawell.app`
- ✅ App Name: `AuraWell`

---

## Step-by-Step Process

### Phase 1: Prepare Your App (Can do on Windows)

#### 1. Build Production React App
```bash
cd C:\Users\Bloss\PycharmProjects\PythonProject\aura-well-copy-1b2413a7
npm run build
```

This creates optimized files in the `dist/` folder.

#### 2. Sync Capacitor (Can do on Windows)
```bash
npx cap sync ios
```

This copies your web app into the iOS project and updates native dependencies.

---

### Phase 2: Transfer to Mac (REQUIRED)

#### 3. Transfer Project to Mac
Options:
- **USB Drive**: Copy entire project folder
- **Git**: Push to GitHub/GitLab, clone on Mac
- **Cloud Storage**: Google Drive, Dropbox, etc.

**Important Files to Transfer:**
- Entire project folder
- Especially the `ios/` folder
- `dist/` folder (from build)
- `node_modules/` (or run `npm install` on Mac)

---

### Phase 3: On Your Mac with Xcode

#### 4. Install Xcode & Dependencies
```bash
# Install Xcode from Mac App Store (it's free but ~12GB)
# Install CocoaPods (iOS dependency manager)
sudo gem install cocoapods

# Navigate to project
cd ~/path/to/aura-well-copy-1b2413a7

# Install iOS dependencies
cd ios/App
pod install
```

#### 5. Open Project in Xcode
```bash
npx cap open ios
```

Or manually:
```bash
open ios/App/App.xcworkspace
```

**⚠️ Important:** Always open `.xcworkspace`, NOT `.xcodeproj`

#### 6. Configure App Metadata in Xcode

In Xcode, select the **App** target and configure:

**General Tab:**
- **Display Name**: AuraWell
- **Bundle Identifier**: com.aurawell.app (must be unique)
- **Version**: 1.0.0
- **Build**: 1

**Signing & Capabilities Tab:**
- Check "Automatically manage signing"
- Select your Apple Developer team
- Xcode will create certificates automatically

#### 7. Update App Icons

Your app needs icons in multiple sizes. Create them at:
`ios/App/App/Assets.xcassets/AppIcon.appiconset/`

Required sizes:
- 1024x1024 (App Store)
- 180x180 (iPhone 3x)
- 120x120 (iPhone 2x)
- 167x167 (iPad Pro)
- 152x152 (iPad 2x)
- 76x76 (iPad 1x)
- And more...

**Easy Solution:** Use a tool like:
- [AppIcon.co](https://appicon.co) - Upload 1024x1024 image, get all sizes
- [MakeAppIcon](https://makeappicon.com)

#### 8. Update Launch Screen (Splash Screen)
Edit: `ios/App/App/Base.lproj/LaunchScreen.storyboard`

Or use Capacitor Splash Screen plugin:
```bash
npm install @capacitor/splash-screen
npx cap sync ios
```

---

### Phase 4: Apple Developer Account Setup

#### 9. Create Apple Developer Account
1. Go to [developer.apple.com](https://developer.apple.com)
2. Enroll in Apple Developer Program ($99/year)
3. Wait for approval (can take 24-48 hours)

#### 10. Create App in App Store Connect
1. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Click "My Apps" → "+" → "New App"
3. Fill in:
   - **Platform**: iOS
   - **Name**: AuraWell
   - **Primary Language**: English
   - **Bundle ID**: com.aurawell.app (select from dropdown)
   - **SKU**: aurawell-app-001 (unique identifier)
   - **User Access**: Full Access

#### 11. Prepare App Store Listing

You'll need:

**Screenshots** (Required for each device type):
- iPhone 6.7" (iPhone 15 Pro Max) - At least 1
- iPhone 6.5" (iPhone 14 Pro Max) - At least 1
- iPhone 5.5" - At least 1
- iPad Pro (6th gen) 12.9" - At least 1

**App Information:**
- **App Name**: AuraWell
- **Subtitle**: (30 characters) e.g., "Mental Health & Wellness"
- **Description**: Detailed description (4000 characters max)
- **Keywords**: Mental health, wellness, meditation, mood tracker
- **Support URL**: Your website
- **Marketing URL**: (Optional)
- **Privacy Policy URL**: **REQUIRED** - Must have one!

**Privacy Information:**
- Data collection practices
- Privacy policy (legally required)

**App Preview Video**: (Optional but recommended)

**Age Rating**: Answer questionnaire

---

### Phase 5: Build & Submit (On Mac)

#### 12. Build for Release

In Xcode:
1. Select **Any iOS Device (arm64)** as destination
2. **Product** → **Archive**
3. Wait for archive to complete (5-10 minutes)

#### 13. Upload to App Store Connect

After archive completes:
1. **Window** → **Organizer**
2. Select your archive
3. Click **Distribute App**
4. Choose **App Store Connect**
5. Choose **Upload**
6. Select signing options (Automatically manage)
7. Click **Upload**
8. Wait for upload (can take 10-30 minutes)

#### 14. Submit for Review

1. Go back to App Store Connect
2. Under your app → **TestFlight** tab
3. Wait for "Processing" to complete (10-60 minutes)
4. Once ready, go to **App Store** tab
5. Select version **1.0**
6. Add required info:
   - Screenshot
   - Description
   - Keywords
   - Support URL
   - Privacy Policy URL
7. Click **Submit for Review**

---

### Phase 6: Review Process

**Review Times:**
- First review: 24-48 hours (sometimes up to 1 week)
- Updates: Usually 24 hours

**Common Rejection Reasons:**
1. Missing privacy policy
2. App crashes on launch
3. Incomplete app metadata
4. Missing required screenshots
5. Using placeholder content

**If Rejected:**
- Read rejection message carefully
- Fix issues
- Resubmit through App Store Connect

---

## Important Capacitor Commands

```bash
# Build web app
npm run build

# Sync changes to iOS
npx cap sync ios

# Open in Xcode
npx cap open ios

# Update Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/ios
npx cap sync ios
```

---

## Testing Before Submission

### On Mac:

**1. Test in Simulator**
```bash
npx cap run ios
```

**2. Test on Real Device**
1. Connect iPhone via USB
2. In Xcode, select your device
3. Click Run (▶️)
4. Trust developer certificate on device

**3. TestFlight (Internal Testing)**
- After upload to App Store Connect
- Add internal testers
- They can install via TestFlight app

---

## Costs Summary

1. **Apple Developer Account**: $99/year (required)
2. **Mac Computer**: $999+ (one-time, if you don't have one)
3. **Domain** (for privacy policy): $10-15/year
4. **Icon Design**: Free (DIY) or $50-200 (professional)

---

## Alternative: Use Mac Cloud Service

If you don't have a Mac:

**MacStadium** ($79-99/month)
**MacinCloud** ($30-80/month)
**Scaleway Mac mini M1** (~$60/month)

These provide remote Mac access.

---

## Privacy Policy Requirement

**You MUST have a privacy policy.** Quick options:

1. **Free Generators**:
   - [App Privacy Policy Generator](https://app-privacy-policy-generator.firebaseapp.com/)
   - [PrivacyPolicies.com](https://www.privacypolicies.com/blog/privacy-policy-template/)

2. **Host it on**:
   - GitHub Pages (free)
   - Your own website
   - Notion (public page)

**What to include**:
- What data you collect
- How you use it
- Third-party services
- User rights
- Contact information

---

## Checklist Before Submission

- [ ] App builds without errors in Xcode
- [ ] Tested on real iPhone device
- [ ] All screenshots prepared
- [ ] Privacy policy URL working
- [ ] App icon set (all sizes)
- [ ] Launch screen configured
- [ ] App metadata filled out
- [ ] Version and build number set
- [ ] Signing certificates configured
- [ ] No placeholder content
- [ ] App doesn't crash on launch
- [ ] All features working

---

## Need Help?

**Common Issues:**

1. **"No signing identity found"**
   - Enable "Automatically manage signing" in Xcode
   - Make sure Apple Developer account is active

2. **"Build failed"**
   - Run `pod install` in `ios/App/`
   - Clean build folder: Product → Clean Build Folder

3. **"Upload failed"**
   - Check internet connection
   - Try again (Apple servers can be slow)

4. **"Invalid Bundle ID"**
   - Must be unique across App Store
   - Try: com.yourname.aurawell

---

## Current Status

**Your project folder:**
```
C:\Users\Bloss\PycharmProjects\PythonProject\aura-well-copy-1b2413a7
```

**App Details:**
- App ID: `com.aurawell.app`
- App Name: `AuraWell`
- Capacitor: v8.0.0

**Next Steps:**
1. Build: `npm run build`
2. Sync: `npx cap sync ios`
3. Transfer to Mac
4. Open in Xcode
5. Follow steps above

---

## Questions to Answer

Before proceeding, clarify:

1. **Do you have access to a Mac?**
   - If no: Consider cloud Mac service or borrowing one

2. **Do you have an Apple Developer account?**
   - If no: Sign up now ($99/year)

3. **Do you have a privacy policy?**
   - If no: Create one (required)

4. **Do you have app icons designed?**
   - If no: Design or hire a designer

5. **Have you tested the app thoroughly?**
   - Test all features before submitting

---

Good luck with your submission! The first time is the hardest, but it gets easier.