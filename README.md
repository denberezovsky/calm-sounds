# 🌿 Calm Nature Sounds - Complete Edition

A beautiful calming app for children with ASD featuring nature sounds, stunning photos, looping videos, and bilingual support (Russian/Hebrew).

## ✨ Complete Features

### 🎵 Nature Sounds
- 🌧️ **Rain** - Gentle rainfall sounds
- 🌊 **Ocean** - Peaceful wave sounds
- 🌲 **Forest** - Serene woodland sounds
- 🌬️ **Wind** - Calming breeze sounds

### 📸 Visual Experience
- **Photos**: Beautiful high-quality nature photos
- **Videos**: Smooth looping nature videos  
- **Swipe Toggle**: Swipe left/right to switch between photo and video
- **Animations**: Gentle overlays (ripples, waves, leaves, clouds)

### 🌐 Language Support
- **Russian (Русский)** - Default language
- **Hebrew (עברית)** - Full RTL (right-to-left) layout
- Tap 🌐 to switch languages anytime
- Remembers your language preference

### 🎨 Design
- Grid view for quick selection
- Immersive full-screen mode
- Smooth transitions and fade effects
- ASD-friendly: clear, predictable, calming

## 📱 How to Use

### Grid View (Main Screen)
1. **Tap 🌐** - Change language (Russian ↔ Hebrew)
2. **Tap any card** - Enter immersive mode for that sound

### Immersive Mode
1. **View**: Full-screen nature photo with sound playing
2. **Swipe left/right**: Toggle between photo and video
3. **Watch**: Gentle animations overlay the photo/video
4. **Tap ← Back**: Return to grid view

### Language Features
- All text translates (buttons, titles, hints)
- Hebrew displays in proper RTL (right-to-left) format
- Choice remembered for next time

## 🚀 Installation Guide

### Step 1: Upload to GitHub

1. **Create GitHub account** at github.com (if you don't have one)
2. **Enable 2FA** (two-factor authentication) - recommended for security
3. **Create new repository**:
   - Click "New repository"
   - Name: `calm-sounds` (or any name you like)
   - Set to **Public** (required for free GitHub Pages)
   - Click "Create repository"

4. **Upload files**:
   - Click "uploading an existing file"
   - **Drag all files and folders** from this folder
   - Important: Upload the entire folder structure (sounds/, images/, videos/)
   - Click "Commit changes"

5. **Enable GitHub Pages**:
   - Go to repository Settings (⚙️)
   - Scroll down to "Pages" section
   - Source: Select "Deploy from a branch"
   - Branch: Select "main" (or "master")
   - Folder: Leave as "/ (root)"
   - Click "Save"
   - Wait 1-2 minutes

6. **Get your URL**:
   - GitHub will show: "Your site is published at https://YOUR-USERNAME.github.io/calm-sounds"
   - This is your app URL!

### Step 2: Install on Tablet

#### Android Tablet (Chrome):
1. Open **Chrome browser**
2. Go to your app URL: `https://YOUR-USERNAME.github.io/calm-sounds`
3. Wait for app to load completely
4. Tap the **three dots menu** (⋮) in top-right
5. Tap **"Add to Home screen"** or **"Install app"**
6. Tap **"Add"** or **"Install"**
7. ✅ **Done!** App icon appears on home screen

#### iPad/iOS (Safari):
1. Open **Safari browser** (must be Safari, not Chrome!)
2. Go to your app URL
3. Wait for app to load completely
4. Tap the **Share button** (square with arrow ↗️)
5. Scroll down and tap **"Add to Home Screen"**
6. Tap **"Add"**
7. ✅ **Done!** App icon appears on home screen

### Step 3: Using the App

After installation:
- ✅ **Works offline** - no internet needed after first load
- ✅ **Opens full-screen** - no browser UI
- ✅ **Like a real app** - icon on home screen
- ✅ **All sounds & media** - photos, videos, animations included

## 📁 What's Included

```
calming-app-final/
├── index.html         - Main app structure
├── style.css          - Styles with RTL support
├── app.js             - App logic with photo/video switching
├── translations.js    - Russian/Hebrew translations
├── manifest.json      - PWA configuration
├── sw.js              - Service worker (offline mode)
├── sounds/            - Audio files (MP3)
│   ├── rain.mp3      - 705 KB
│   ├── ocean.mp3     - 705 KB
│   ├── forest.mp3    - 705 KB
│   └── wind.mp3      - 705 KB
├── images/            - Photo backgrounds (JPEG)
│   ├── rain.jpeg     - 656 KB
│   ├── ocean.jpeg    - 831 KB
│   ├── forest.jpeg   - 1.1 MB
│   └── wind.jpeg     - 883 KB
├── videos/            - Video backgrounds (MP4)
│   ├── rain.mp4      - 4.9 MB
│   ├── ocean.mp4     - 7.4 MB
│   ├── forest.mp4    - 6.6 MB
│   └── wind.mp4      - 8.5 MB
└── README.md          - This file
```

**Total Size:** ~33 MB (well within GitHub Pages limits)

## 🎯 User Guide

### For Parents

**Designed for 6-year-old with ASD:**
- ✅ Simple, clear interface
- ✅ No surprises or pop-ups
- ✅ Predictable behavior
- ✅ Calming colors and motion
- ✅ No ads, no tracking
- ✅ Works completely offline

**How it helps:**
- **Calming**: Nature sounds + visuals for relaxation
- **Predictable**: Same experience every time
- **Engaging**: Beautiful photos and videos
- **Educational**: Language exposure (Russian/Hebrew)
- **Independent**: Kid can use alone

### For Kids

**Easy Steps:**
1. Tap the sound you want (Rain/Ocean/Forest/Wind)
2. Watch the pretty picture
3. Swipe to see a video instead
4. Swipe back to see the picture
5. Tap the arrow ← to choose a different sound

**Fun Things:**
- See raindrops falling 🌧️
- Watch ocean waves rolling 🌊
- See leaves dancing 🍃
- Watch clouds floating ☁️

## ⚙️ Customization

### Change Default Language
In `app.js`, line 5:
```javascript
this.currentLang = localStorage.getItem('language') || 'ru';
// Change 'ru' to 'he' to start with Hebrew
```

### Adjust Sound Volume
In `app.js`, look for `setVolume(0.7)` and change:
- `0.5` = quieter
- `0.7` = current (recommended)
- `0.9` = louder

### Modify Colors
In `style.css`, find `.sound-card` backgrounds:
```css
.sound-card.rain {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}
```

### Change Animation Speed
In `style.css`, find animations:
```css
animation: ripple-animation 3s ease-out infinite;
// Change 3s to 5s for slower, 2s for faster
```

## 📊 Technical Details

- **Technologies**: HTML5, CSS3, Vanilla JavaScript
- **Audio**: MP3 format, looped playback with fade in/out
- **Images**: JPEG, optimized for web
- **Video**: MP4 (H.264), 15 seconds looping, muted
- **PWA**: Full Progressive Web App support
- **Offline**: Works 100% offline after first load
- **Storage**: All media cached locally
- **Privacy**: Zero tracking, zero analytics, zero data collection

### Compatibility
- ✅ iOS 11.3+ (Safari)
- ✅ Android 5.0+ (Chrome)
- ✅ iPad OS
- ✅ Chrome OS
- ⚠️ Desktop browsers (works, but designed for mobile)

### Performance
- First load: ~30-60 seconds (downloads all media)
- After first load: Instant (everything cached)
- Memory usage: ~100-150 MB
- Battery impact: Minimal (optimized videos)

## 🔒 Privacy & Safety

- ✅ **No internet required** after installation
- ✅ **No tracking** or analytics
- ✅ **No cookies** or third-party scripts
- ✅ **No data collection** whatsoever
- ✅ **No ads** or pop-ups
- ✅ **Child-safe** content only
- ✅ **Open source** - you can review all code

## 🐛 Troubleshooting

**Problem**: Videos don't play
- **Solution**: iOS/Safari requires user interaction. Videos will autoplay after first tap.

**Problem**: Sounds don't play on iOS
- **Solution**: iOS requires user tap for audio. Working as designed.

**Problem**: App doesn't install
- **Solution 1**: On iOS, must use Safari (not Chrome)
- **Solution 2**: On Android, must use Chrome
- **Solution 3**: Clear browser cache and try again

**Problem**: Videos are choppy
- **Solution**: First load may be slow. Videos will play smoothly once cached.

**Problem**: Hebrew text shows incorrectly
- **Solution**: Ensure device has Hebrew font support. Try different browser.

**Problem**: Swipe doesn't work
- **Solution**: Swipe left or right more firmly. Minimum 50px swipe distance required.

**Problem**: GitHub Pages not working
- **Solution 1**: Wait 2-5 minutes after enabling
- **Solution 2**: Check repository is Public (not Private)
- **Solution 3**: Clear browser cache
- **Solution 4**: Check all files uploaded correctly

## 🔄 Updates

To update the app after it's published:
1. Edit files on GitHub (or upload new versions)
2. Commit changes
3. Wait 1-2 minutes
4. App updates automatically next time user opens it
5. For major changes, user might need to reinstall

## 📝 Future Ideas

Potential enhancements (not included, but easy to add):
- [ ] More sounds (birds, campfire, thunder)
- [ ] Timer (auto-stop after X minutes)
- [ ] Favorites system
- [ ] Volume slider per sound
- [ ] Mix sounds (play multiple at once)
- [ ] Dark mode
- [ ] More languages (English, Spanish, etc.)
- [ ] Breathing exercises
- [ ] Parent settings panel

## 💝 Credits

- **Sounds**: Generated via ElevenLabs
- **Photos**: AI-generated nature imagery
- **Videos**: AI-generated nature loops
- **Code**: Built with care for a special kid
- **Design**: Optimized for ASD-friendly experience

## 📄 License

Free to use and modify for personal use.
Media files (sounds/photos/videos) are yours to use.

---

**Made with ❤️ for peaceful, calming moments**

Enjoy! 🌿✨

## 🆘 Need Help?

If you get stuck:
1. Re-read the installation steps carefully
2. Check GitHub repository is Public
3. Wait 2-5 minutes after enabling Pages
4. Try on different device/browser
5. Clear browser cache

Remember: The app is designed to be simple and reliable. If something seems complicated, you might be overthinking it! 😊
