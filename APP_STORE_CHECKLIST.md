# iOS App Store Submission Checklist - AuraWell

## 📱 Project Information

- **App Name**: AuraWell
- **Bundle ID**: com.aurawell.app
- **Capacitor Version**: 8.0.0
- **Project Path**: `C:\Users\Bloss\PycharmProjects\PythonProject\aura-well-copy-1b2413a7`

---

## ⚠️ CRITICAL REQUIREMENTS

### 1. Mac Requirement
- [ ] I have access to a Mac computer
- [ ] OR I have signed up for a cloud Mac service (MacStadium, MacinCloud)
- [ ] Xcode 15+ is installed (or will be installed)

**If you don't have a Mac, STOP HERE. You cannot proceed without one.**

### 2. Apple Developer Account
- [ ] I have enrolled in Apple Developer Program ($99/year)
- [ ] My account has been approved (can take 24-48 hours)
- [ ] I can log into [developer.apple.com](https://developer.apple.com)
- [ ] I can log into [appstoreconnect.apple.com](https://appstoreconnect.apple.com)

### 3. Privacy Policy (REQUIRED)
- [ ] I have written a privacy policy
- [ ] Privacy policy is hosted at a public URL
- [ ] URL is accessible: ___________________

**Template**: See `PRIVACY_POLICY_TEMPLATE.md`

---

## 🎨 Design Assets Needed

### App Icon (Required)
Create a 1024x1024px app icon, then generate all sizes.

**Tools:**
- [AppIcon.co](https://appicon.co)
- [MakeAppIcon](https://makeappicon.com)

- [ ] 1024x1024 master icon designed
- [ ] All icon sizes generated
- [ ] Icons placed in `ios/App/App/Assets.xcassets/AppIcon.appiconset/`

### Screenshots (Required)

You need screenshots for:

**iPhone:**
- [ ] iPhone 6.7" (1290 x 2796) - iPhone 15 Pro Max - At least 1 screenshot
- [ ] iPhone 6.5" (1284 x 2778) - iPhone 14 Pro Max - At least 1 screenshot
- [ ] iPhone 5.5" (1242 x 2208) - iPhone 8 Plus - At least 1 screenshot

**iPad:**
- [ ] iPad Pro 12.9" (2048 x 2732) - At least 1 screenshot

**How to take screenshots:**
1. Run app in iOS Simulator (on Mac)
2. Cmd+S to save screenshot
3. Or use Xcode's screenshot tool

### App Preview Video (Optional but Recommended)
- [ ] Created 15-30 second app preview video
- [ ] Video uploaded to App Store Connect

---

## 📝 App Store Listing Information

### Basic Information
- [ ] **App Name**: AuraWell (or your chosen name)
- [ ] **Subtitle** (30 chars): _____________________
      Example: "Mental Health & Wellness"
- [ ] **Primary Language**: English
- [ ] **Category**: Health & Fitness (or Medical)
- [ ] **SKU**: aurawell-app-001 (unique ID)

### Description
- [ ] **Short description** written (170 characters)
- [ ] **Full description** written (max 4000 characters)

**Tips:**
- Explain what the app does
- Highlight key features
- Mention benefits
- Include keywords naturally

### Keywords
- [ ] Keywords selected (100 characters max, comma-separated)

**Examples:**
```
mental health,wellness,meditation,mood tracker,journal,anxiety,depression,therapy,mindfulness
```

### URLs
- [ ] **Support URL**: _____________________
- [ ] **Marketing URL**: _____________________ (optional)
- [ ] **Privacy Policy URL**: _____________________

### Contact Information
- [ ] **Support Email**: _____________________
- [ ] **Phone Number**: _____________________ (optional)

---

## 🔒 App Privacy & Compliance

### Privacy Questionnaire
You'll need to answer these in App Store Connect:

- [ ] Does your app collect data?
- [ ] What types of data? (Health, Usage, Identifiers, etc.)
- [ ] How is data used?
- [ ] Is data shared with third parties?
- [ ] Can users request data deletion?

### Age Rating
- [ ] Complete age rating questionnaire in App Store Connect
- [ ] Expected rating: 4+ or 12+ (based on mental health content)

### Export Compliance
- [ ] Answer: "Does your app use encryption?"
- [ ] Most likely: YES (HTTPS uses encryption)
- [ ] Choose: "No, it only uses standard encryption"

---

## 💻 Technical Preparation (Windows - Do This Now)

### Step 1: Build Production App
```bash
cd C:\Users\Bloss\PycharmProjects\PythonProject\aura-well-copy-1b2413a7
npm run build
```

- [ ] Build completed successfully
- [ ] `dist/` folder created with production files

### Step 2: Sync Capacitor
```bash
npx cap sync ios
```

- [ ] Capacitor synced without errors
- [ ] iOS project updated

### Step 3: Run Preparation Script
```bash
prepare-ios.bat
```

- [ ] Script completed successfully
- [ ] No errors reported

---

## 🍎 Mac Setup (After Transfer)

### Transfer to Mac
- [ ] Entire project folder copied to Mac
- [ ] All files transferred successfully
- [ ] Node.js installed on Mac

### Install Dependencies (On Mac)
```bash
# Install CocoaPods
sudo gem install cocoapods

# Navigate to project
cd ~/path/to/aura-well-copy-1b2413a7

# Install npm packages (if needed)
npm install

# Install iOS pods
cd ios/App
pod install
```

- [ ] CocoaPods installed
- [ ] Pods installed successfully
- [ ] No errors

### Open in Xcode
```bash
npx cap open ios
```

- [ ] Xcode opened successfully
- [ ] Project loaded without errors

---

## ⚙️ Xcode Configuration

### General Tab
- [ ] **Display Name**: AuraWell
- [ ] **Bundle Identifier**: com.aurawell.app (or unique ID)
- [ ] **Version**: 1.0.0
- [ ] **Build**: 1
- [ ] **Deployment Target**: iOS 15.0 or later

### Signing & Capabilities
- [ ] "Automatically manage signing" enabled
- [ ] Team selected (your Apple Developer account)
- [ ] Signing certificate created
- [ ] Provisioning profile created

### Info.plist (Permissions)
Add descriptions for any permissions your app needs:
- [ ] Camera access (if used)
- [ ] Microphone access (if used)
- [ ] Notifications (if used)
- [ ] Health data (if used)

---

## 🧪 Testing

### Simulator Testing
- [ ] App runs in iOS Simulator without crashes
- [ ] All features work correctly
- [ ] Navigation works
- [ ] No console errors

### Real Device Testing
- [ ] App runs on real iPhone
- [ ] Tested on iOS 15+
- [ ] Tested on iOS 16+
- [ ] Tested on iOS 17+
- [ ] All features work on device

### TestFlight (Internal Testing)
- [ ] App uploaded to TestFlight
- [ ] Internal testers added
- [ ] Feedback received and issues fixed

---

## 📤 Build & Upload

### Archive Build
In Xcode:
1. Select "Any iOS Device (arm64)"
2. Product → Archive

- [ ] Archive created successfully
- [ ] No build errors
- [ ] Archive appears in Organizer

### Upload to App Store Connect
- [ ] Archive uploaded successfully
- [ ] Processing completed (wait 10-60 minutes)
- [ ] Build appears in App Store Connect

---

## 📋 App Store Connect Setup

### Create App
- [ ] App created in App Store Connect
- [ ] Basic information filled in
- [ ] Bundle ID matched

### Version Information
- [ ] Screenshots uploaded (all required sizes)
- [ ] App preview video uploaded (if created)
- [ ] Description written
- [ ] Keywords added
- [ ] URLs added
- [ ] Age rating completed
- [ ] Privacy information completed

### Pricing & Availability
- [ ] **Price**: Free (or select price tier)
- [ ] **Availability**: All countries (or select specific ones)
- [ ] **Pre-orders**: No (for first submission)

---

## 🚀 Submit for Review

### Pre-Submission Checklist
- [ ] All required screenshots uploaded
- [ ] Privacy policy URL working
- [ ] Support URL working
- [ ] App description complete
- [ ] Keywords set
- [ ] Age rating completed
- [ ] Export compliance answered
- [ ] Build selected
- [ ] No placeholder text or images

### Submit
- [ ] Clicked "Submit for Review"
- [ ] Submission confirmed
- [ ] Status changed to "Waiting for Review"

---

## ⏳ Review Process

### After Submission
- [ ] Received confirmation email
- [ ] App status: "Waiting for Review"

**Expected timeline:**
- First submission: 24-48 hours (can be up to 1 week)
- Updates: Usually 24 hours

### If Approved
- [ ] Received approval email
- [ ] App status: "Ready for Sale"
- [ ] App appears in App Store

### If Rejected
- [ ] Read rejection reason carefully
- [ ] Fix issues mentioned
- [ ] Re-submit

**Common rejection reasons:**
1. Missing privacy policy
2. App crashes
3. Incomplete metadata
4. Missing screenshots
5. Placeholder content

---

## 📊 Post-Launch

### Monitor
- [ ] Check App Store Connect analytics
- [ ] Monitor crash reports
- [ ] Read user reviews
- [ ] Respond to feedback

### Updates
- [ ] Plan update schedule
- [ ] Fix bugs
- [ ] Add new features
- [ ] Submit updates

---

## 🆘 Common Issues & Solutions

### "No signing identity found"
**Solution**: Enable "Automatically manage signing" in Xcode

### "Build failed - pod install"
**Solution**:
```bash
cd ios/App
pod deintegrate
pod install
```

### "Invalid Bundle ID"
**Solution**: Bundle ID must be unique. Try: com.yourname.aurawell

### "Upload failed"
**Solution**: Check internet connection, try again

### "App crashes on launch"
**Solution**: Check console logs in Xcode, fix errors

---

## 💰 Cost Summary

- [ ] Apple Developer Account: $99/year - **REQUIRED**
- [ ] Mac Computer: $999+ OR Cloud Mac: $30-99/month - **REQUIRED**
- [ ] Domain for privacy policy: $10-15/year - Optional (use GitHub Pages free)
- [ ] Icon design: Free (DIY) or $50-200 - Up to you
- [ ] App screenshots: Free (DIY) - Recommended

**Minimum cost to publish**: $99/year (if you have a Mac)

---

## 📞 Support Resources

**Apple:**
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

**Capacitor:**
- [Capacitor iOS Documentation](https://capacitorjs.com/docs/ios)
- [Capacitor Community Forum](https://forum.ionicframework.com/)

**Tools:**
- [AppIcon.co](https://appicon.co) - Generate app icons
- [App Privacy Policy Generator](https://app-privacy-policy-generator.firebaseapp.com/)
- [Screenshot Creator](https://www.screenshotbuilder.com/)

---

## ✅ Current Status

**Completed:**
- ✅ Capacitor project configured
- ✅ iOS folder created
- ✅ Bundle ID set

**Pending:**
- ⏳ Mac access
- ⏳ Apple Developer account
- ⏳ Privacy policy
- ⏳ App icons
- ⏳ Screenshots
- ⏳ App Store listing

**Next Action**:
1. If you have a Mac → Run `prepare-ios.bat` on Windows, transfer to Mac
2. If no Mac → Sign up for cloud Mac service or borrow one
3. Enroll in Apple Developer Program
4. Create privacy policy

---

## 📝 Notes

Use this space for your own notes:

```
_____________________________________________________________________

_____________________________________________________________________

_____________________________________________________________________

_____________________________________________________________________

_____________________________________________________________________
```

---

Good luck with your app submission! 🚀