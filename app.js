// App State
class CalmSoundsApp {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'ru';
        this.sounds = {
            rain: document.getElementById('rain-audio'),
            ocean: document.getElementById('ocean-audio'),
            forest: document.getElementById('forest-audio'),
            wind: document.getElementById('wind-audio')
        };
        
        this.currentSound = null;
        this.isVideoMode = false; // false = photo, true = video
        this.currentVideo = null;
        
        this.init();
    }
    
    init() {
        this.setupLanguage();
        this.setupCards();
        this.setupLanguageSelector();
        this.setupBackButton();
        this.setupSwipeGesture();
        this.setupServiceWorker();
        this.setVolume(0.7);
    }
    
    // Language Management
    setupLanguage() {
        this.applyLanguage(this.currentLang);
    }
    
    applyLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('language', lang);
        
        document.documentElement.lang = lang;
        
        if (lang === 'he') {
            document.body.classList.add('rtl');
        } else {
            document.body.classList.remove('rtl');
        }
        
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });
        
        const title = document.getElementById('app-title');
        if (title) {
            title.textContent = translations[lang].title;
        }
        
        document.querySelectorAll('.lang-option').forEach(opt => {
            const optLang = opt.getAttribute('data-lang');
            if (optLang === lang) {
                opt.classList.add('active');
                opt.textContent = '✓ ' + (lang === 'ru' ? 'Русский' : 'עברית');
            } else {
                opt.classList.remove('active');
                opt.textContent = optLang === 'ru' ? 'Русский' : 'עברית';
            }
        });
    }
    
    setupLanguageSelector() {
        const langButton = document.getElementById('lang-button');
        const langMenu = document.getElementById('lang-menu');
        
        langButton.addEventListener('click', (e) => {
            e.stopPropagation();
            langMenu.classList.toggle('hidden');
        });
        
        const langButtonImmersive = document.getElementById('lang-button-immersive');
        const langMenuImmersive = document.getElementById('lang-menu-immersive');
        
        langButtonImmersive.addEventListener('click', (e) => {
            e.stopPropagation();
            langMenuImmersive.classList.toggle('hidden');
        });
        
        document.querySelectorAll('.lang-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const lang = option.getAttribute('data-lang');
                this.applyLanguage(lang);
                
                langMenu.classList.add('hidden');
                langMenuImmersive.classList.add('hidden');
                
                if (this.currentSound) {
                    this.updateImmersiveSoundName();
                }
            });
        });
        
        document.addEventListener('click', () => {
            langMenu.classList.add('hidden');
            langMenuImmersive.classList.add('hidden');
        });
    }
    
    setupCards() {
        const cards = document.querySelectorAll('.sound-card');
        
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const soundType = card.dataset.sound;
                this.openImmersiveMode(soundType);
            });
            
            card.addEventListener('touchstart', (e) => {
                e.preventDefault();
                card.style.transform = 'scale(0.95)';
            });
            
            card.addEventListener('touchend', (e) => {
                e.preventDefault();
                card.style.transform = '';
                const soundType = card.dataset.sound;
                this.openImmersiveMode(soundType);
            });
        });
    }
    
    // Immersive Mode
    openImmersiveMode(soundType) {
        this.currentSound = soundType;
        this.isVideoMode = false; // Start with photo
        
        const gridView = document.getElementById('grid-view');
        const immersiveView = document.getElementById('immersive-view');
        
        gridView.classList.add('hidden');
        immersiveView.classList.remove('hidden');
        
        this.playSound(soundType);
        this.setImmersiveBackground(soundType, false); // Start with photo
        this.setImmersiveAnimations(soundType);
        this.updateImmersiveSoundName();
    }
    
    closeImmersiveMode() {
        const gridView = document.getElementById('grid-view');
        const immersiveView = document.getElementById('immersive-view');
        
        if (this.currentSound) {
            this.stopSound(this.currentSound);
        }
        
        // Stop and clean up video if playing
        if (this.currentVideo) {
            this.currentVideo.pause();
            this.currentVideo.remove();
            this.currentVideo = null;
        }
        
        immersiveView.classList.add('hidden');
        gridView.classList.remove('hidden');
        
        this.currentSound = null;
        this.isVideoMode = false;
    }
    
    updateImmersiveSoundName() {
        const nameEl = document.getElementById('immersive-sound-name');
        if (nameEl && this.currentSound) {
            nameEl.textContent = soundNames[this.currentLang][this.currentSound];
        }
    }
    
    setImmersiveBackground(soundType, isVideo) {
        const bg = document.getElementById('immersive-bg');
        
        // Clear existing content
        bg.innerHTML = '';
        bg.style.backgroundImage = '';
        
        if (isVideo) {
            // Create and play video
            const video = document.createElement('video');
            video.className = 'immersive-video';
            video.src = `videos/${soundType}.mp4`;
            video.autoplay = true;
            video.loop = true;
            video.muted = true;
            video.playsInline = true;
            
            bg.appendChild(video);
            this.currentVideo = video;
            
            // Fade in video
            video.style.opacity = '0';
            video.addEventListener('loadeddata', () => {
                setTimeout(() => {
                    video.style.opacity = '1';
                }, 100);
            });
        } else {
            // Stop video if it exists
            if (this.currentVideo) {
                this.currentVideo.pause();
                this.currentVideo.remove();
                this.currentVideo = null;
            }
            
            // Set photo background
            bg.style.backgroundImage = `url('images/${soundType}.jpeg')`;
        }
    }
    
    setImmersiveAnimations(soundType) {
        const animLayer = document.getElementById('immersive-animation');
        animLayer.innerHTML = '';
        
        if (soundType === 'rain') {
            for (let i = 1; i <= 3; i++) {
                const ripple = document.createElement('div');
                ripple.className = `ripple ripple-${i}`;
                animLayer.appendChild(ripple);
            }
        } else if (soundType === 'ocean') {
            for (let i = 1; i <= 3; i++) {
                const wave = document.createElement('div');
                wave.className = `wave wave-${i}`;
                animLayer.appendChild(wave);
            }
        } else if (soundType === 'forest') {
            for (let i = 1; i <= 5; i++) {
                const leaf = document.createElement('div');
                leaf.className = `leaf leaf-${i}`;
                leaf.textContent = '🍃';
                animLayer.appendChild(leaf);
            }
        } else if (soundType === 'wind') {
            for (let i = 1; i <= 3; i++) {
                const cloud = document.createElement('div');
                cloud.className = `cloud cloud-${i}`;
                cloud.textContent = '☁️';
                animLayer.appendChild(cloud);
            }
        }
    }
    
    setupBackButton() {
        const backButton = document.getElementById('back-button');
        backButton.addEventListener('click', () => {
            this.closeImmersiveMode();
        });
    }
    
    setupSwipeGesture() {
        const immersiveContent = document.querySelector('.immersive-content');
        let touchStartX = 0;
        let touchEndX = 0;
        
        immersiveContent.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        immersiveContent.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });
        
        const handleSwipe = () => {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold && this.currentSound) {
                // Toggle between photo and video
                this.isVideoMode = !this.isVideoMode;
                
                // Update background with smooth transition
                const bg = document.getElementById('immersive-bg');
                bg.style.opacity = '0';
                
                setTimeout(() => {
                    this.setImmersiveBackground(this.currentSound, this.isVideoMode);
                    setTimeout(() => {
                        bg.style.opacity = '1';
                    }, 100);
                }, 300);
            }
        };
        
        this.handleSwipe = handleSwipe;
    }
    
    // Sound Controls
    async playSound(soundType) {
        const audio = this.sounds[soundType];
        
        try {
            audio.volume = 0;
            await audio.play();
            await this.fadeIn(audio);
        } catch (error) {
            console.error('Playback error:', error);
        }
    }
    
    async stopSound(soundType) {
        const audio = this.sounds[soundType];
        await this.fadeOut(audio);
        audio.pause();
    }
    
    async fadeIn(audio, duration = 1000) {
        const targetVolume = 0.7;
        const steps = 20;
        const stepDuration = duration / steps;
        const volumeStep = targetVolume / steps;
        
        for (let i = 0; i <= steps; i++) {
            audio.volume = Math.min(volumeStep * i, targetVolume);
            await this.sleep(stepDuration);
        }
    }
    
    async fadeOut(audio, duration = 1000) {
        const startVolume = audio.volume;
        const steps = 20;
        const stepDuration = duration / steps;
        const volumeStep = startVolume / steps;
        
        for (let i = steps; i >= 0; i--) {
            audio.volume = Math.max(volumeStep * i, 0);
            await this.sleep(stepDuration);
        }
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    setVolume(volume) {
        Object.values(this.sounds).forEach(audio => {
            audio.volume = volume;
        });
    }
    
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js')
                .then(registration => console.log('SW registered:', registration))
                .catch(error => console.log('SW registration failed:', error));
        }
    }
}

// Initialize app
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new CalmSoundsApp();
    });
} else {
    new CalmSoundsApp();
}

// Prevent double-tap zoom
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);
