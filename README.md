# 🌿 Звуки природы - 6 Sounds Edition

Interactive calming app with **6 nature sounds**, voice feedback, and catch games. Perfect for children with ASD.

## ✨ All 6 Sounds

### 🌧️ Rain (Дождь / גשם)
- Gentle rainfall sounds
- Catch falling raindrops 💧
- Ripple animations

### 🌊 Ocean (Океан / אוקיינוס)
- Peaceful wave sounds  
- Pop rising bubbles 🫧
- Wave animations

### 🌲 Forest (Лес / יער)
- Serene woodland sounds
- Catch falling leaves 🍃
- Leaf animations

### 🌬️ Wind (Ветер / רוח)
- Calming breeze sounds
- Touch drifting clouds ☁️
- Cloud animations

### 🔥 Campfire (Костёр / מדורה) - NEW!
- Crackling fire sounds
- Catch rising sparks ✨
- Warm, cozy atmosphere
- Perfect for evening relaxation

### 💦 Waterfall (Водопад / מפל מים) - NEW!
- Rushing water sounds
- Catch fast-falling droplets 💧
- Misty, peaceful scene
- Energizing yet calming

## 🎯 Features

- **Voice Feedback**: Hear sound name when tapped (Russian + Hebrew)
- **Interactive Games**: Level 2 catch mechanics with score tracking
- **Beautiful Media**: Photos + Videos for each sound
- **Bilingual**: Full Russian/Hebrew support with RTL
- **PWA Ready**: Install as app on any device
- **Offline First**: Works completely offline

## 📱 Layout

**2x3 Grid (Desktop/Tablet):**
```
┌────────────────────────┐
│ Звуки природы      🌐  │
├───────┬────────┬───────┤
│ Rain  │ Ocean  │Forest │
├───────┼────────┼───────┤
│ Wind  │Campfire│Waterfall
└───────┴────────┴───────┘
```

**2x3 Grid (Mobile):**
Automatically adjusts to 2 columns on small screens

## 🎮 New Game Mechanics

### Campfire Game 🔥
- Sparks float **upward** from fire
- Tap to catch twinkling sparks
- Faster than leaves, slower than bubbles
- Creates warm, cozy feeling

### Waterfall Game 💦
- Droplets fall **faster** than rain
- Represents powerful flowing water
- More challenging catch game
- Energizing gameplay

## 🚀 Quick Start

1. **Download** the folder
2. **Upload to GitHub**: github.com/denberezovsky/calm-sounds
3. **Wait 2-3 minutes** for Pages to build
4. **Visit**: denberezovsky.github.io/calm-sounds
5. **Install** on tablet via "Add to Home Screen"

## 📊 What's New

| Feature | Before (4 sounds) | Now (6 sounds) |
|---------|------------------|----------------|
| Sounds | Rain, Ocean, Forest, Wind | + Campfire, Waterfall ✅ |
| Grid | 2x2 | 2x3 ✅ |
| Games | 4 games | 6 games ✅ |
| Voice files | 8 files | 12 files ✅ |
| Total size | ~35 MB | ~58 MB ✅ |

## 📁 File Structure

```
calm-sounds-v6/
├── sounds/ (6 MP3s - ~4.2 MB)
│   ├── rain.mp3
│   ├── ocean.mp3
│   ├── forest.mp3
│   ├── wind.mp3
│   ├── campfire.mp3 ⭐ NEW
│   └── waterfall.mp3 ⭐ NEW
├── voices/ (12 MP3s - ~450 KB)
│   ├── voice-{sound}-ru.mp3 (6 files)
│   └── voice-{sound}-he.mp3 (6 files)
├── images/ (6 JPEGs - ~6 MB)
│   └── campfire.jpeg, waterfall.jpeg ⭐ NEW
├── videos/ (6 MP4s - ~48 MB)
│   └── campfire.mp4, waterfall.mp4 ⭐ NEW
└── [app files]
```

**Total: ~58 MB** (still well within GitHub Pages 100GB/month limit!)

## 🎨 Sound Categories

**Water Sounds:** Rain, Ocean, Waterfall  
**Nature Sounds:** Forest, Wind  
**Fire Sound:** Campfire

**Perfect variety for different moods and times of day!**

## 🌐 Languages

- Russian (Русский) - default
- Hebrew (עברית) - full RTL support

All UI elements translate including new sounds.

## 💡 Usage Tips

**Morning:** Waterfall (energizing) + Birds
**Daytime:** Ocean, Forest  
**Evening:** Campfire (cozy) + Wind  
**Bedtime:** Rain (gentle) + Forest

## 🔧 Customization

### Game Difficulty

Adjust spawn rate in `app.js`:
```javascript
}, 2000); // 2000 = easy, 1500 = medium, 1000 = hard
```

### Waterfall Speed

Adjust droplet speed in `app.js`:
```javascript
if (soundType === 'waterfall') {
    element.speed = 2 + Math.random() * 3; // Adjust multiplier
}
```

## 🎯 Design Notes

**Campfire:**
- Warm orange/yellow gradient
- Sparks rise like bubbles (reversed gravity)
- Cozy, evening vibe
- Not scary or intense

**Waterfall:**
- Cool teal/green gradient  
- Droplets fall faster than rain
- Powerful but peaceful
- Energizing atmosphere

## 📝 Credits

- Nature sounds: ElevenLabs AI
- Voice files: ElevenLabs TTS
- Photos/Videos: AI-generated
- Interactive games: Custom canvas implementation
- Design: Optimized for ASD experience

---

**Enjoy 6 beautiful nature sounds!** 🌿🔥💦

Made with ❤️ for calm, engaging moments
