// Enhanced Calm Sounds App with Voice and Interactive Games
class CalmSoundsApp {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'ru';
        this.sounds = {
            rain: document.getElementById('rain-audio'),
            ocean: document.getElementById('ocean-audio'),
            forest: document.getElementById('forest-audio'),
            wind: document.getElementById('wind-audio'),
            campfire: document.getElementById('campfire-audio'),
            waterfall: document.getElementById('waterfall-audio')
        };
        
        this.currentSound = null;
        this.isVideoMode = false;
        this.currentVideo = null;
        
        // Game state
        this.gameActive = false;
        this.score = 0;
        this.gameElements = [];
        this.canvas = null;
        this.ctx = null;
        this.animationFrame = null;
        
        this.init();
    }
    
    init() {
        this.setupLanguage();
        this.setupCards();
        this.setupLanguageSelector();
        this.setupBackButton();
        this.setupSwipeGesture();
        this.setupCanvas();
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
            });
        });
        
        document.addEventListener('click', () => {
            langMenu.classList.add('hidden');
            langMenuImmersive.classList.add('hidden');
        });
    }
    
    // Voice Playback
    playSoundVoice(soundType) {
        const voiceId = `voice-${soundType}-${this.currentLang}`;
        const voiceAudio = document.getElementById(voiceId);
        
        if (voiceAudio) {
            voiceAudio.currentTime = 0;
            voiceAudio.play().catch(err => console.log('Voice playback error:', err));
        }
    }
    
    setupCards() {
        const cards = document.querySelectorAll('.sound-card');
        
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const soundType = card.dataset.sound;
                
                // Play voice
                this.playSoundVoice(soundType);
                
                // Small delay before opening immersive (let voice play a bit)
                setTimeout(() => {
                    this.openImmersiveMode(soundType);
                }, 300);
            });
            
            card.addEventListener('touchstart', (e) => {
                e.preventDefault();
                card.style.transform = 'scale(0.95)';
            });
            
            card.addEventListener('touchend', (e) => {
                e.preventDefault();
                card.style.transform = '';
                const soundType = card.dataset.sound;
                
                this.playSoundVoice(soundType);
                
                setTimeout(() => {
                    this.openImmersiveMode(soundType);
                }, 300);
            });
        });
    }
    
    // Canvas Setup for Games
    setupCanvas() {
        this.canvas = document.getElementById('game-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        
        // Make canvas interactive
        this.canvas.style.pointerEvents = 'auto';
        
        // Touch/click handler for catching elements
        this.canvas.addEventListener('click', (e) => this.handleGameClick(e));
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const touch = e.changedTouches[0];
            const rect = this.canvas.getBoundingClientRect();
            const clickEvent = {
                clientX: touch.clientX,
                clientY: touch.clientY
            };
            this.handleGameClick(clickEvent);
        });
    }
    
    resizeCanvas() {
        if (!this.canvas) return;
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }
    
    // Game Click Handler
    handleGameClick(e) {
        if (!this.gameActive) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Check if clicked on any game element
        for (let i = this.gameElements.length - 1; i >= 0; i--) {
            const element = this.gameElements[i];
            const distance = Math.sqrt(
                Math.pow(x - element.x, 2) + Math.pow(y - element.y, 2)
            );
            
            if (distance < element.size) {
                // Caught it!
                this.catchElement(i);
                break;
            }
        }
    }
    
    catchElement(index) {
        const element = this.gameElements[index];
        
        // Create catch effect
        this.createCatchEffect(element.x, element.y);
        
        // Remove element
        this.gameElements.splice(index, 1);
        
        // Increment score
        this.score++;
        this.updateScore();
    }
    
    createCatchEffect(x, y) {
        // Visual feedback - growing circle
        const effect = {
            x, y,
            radius: 10,
            opacity: 1,
            growing: true
        };
        
        const animate = () => {
            if (effect.radius < 50) {
                effect.radius += 3;
                effect.opacity -= 0.05;
                
                this.ctx.save();
                this.ctx.globalAlpha = effect.opacity;
                this.ctx.strokeStyle = '#fff';
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.restore();
                
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
    
    updateScore() {
        const scoreDisplay = document.getElementById('score-display');
        const scoreText = document.getElementById('score-text');
        
        if (scoreDisplay && scoreText) {
            const label = this.currentSound === 'ocean' ? 
                translations[this.currentLang].popped : 
                translations[this.currentLang].caught;
            
            const emoji = {
                rain: '💧',
                ocean: '🫧',
                forest: '🍃',
                wind: '☁️'
            }[this.currentSound] || '';
            
            scoreText.textContent = `${label} ${this.score} ${emoji}`;
            scoreDisplay.classList.remove('hidden');
        }
    }
    
    // Immersive Mode
    openImmersiveMode(soundType) {
        this.currentSound = soundType;
        this.isVideoMode = false;
        
        const gridView = document.getElementById('grid-view');
        const immersiveView = document.getElementById('immersive-view');
        
        gridView.classList.add('hidden');
        immersiveView.classList.remove('hidden');
        
        this.playSound(soundType);
        this.setImmersiveBackground(soundType, false);
        this.setImmersiveAnimations(soundType);
        
        // Start interactive game
        this.resizeCanvas();
        this.startGame(soundType);
    }
    
    closeImmersiveMode() {
        const gridView = document.getElementById('grid-view');
        const immersiveView = document.getElementById('immersive-view');
        
        if (this.currentSound) {
            this.stopSound(this.currentSound);
        }
        
        if (this.currentVideo) {
            this.currentVideo.pause();
            this.currentVideo.remove();
            this.currentVideo = null;
        }
        
        // Stop game
        this.stopGame();
        
        immersiveView.classList.add('hidden');
        gridView.classList.remove('hidden');
        
        this.currentSound = null;
        this.isVideoMode = false;
    }
    
    setImmersiveBackground(soundType, isVideo) {
        const bg = document.getElementById('immersive-bg');
        
        bg.innerHTML = '';
        bg.style.backgroundImage = '';
        
        if (isVideo) {
            const video = document.createElement('video');
            video.className = 'immersive-video';
            video.src = `videos/${soundType}.mp4`;
            video.autoplay = true;
            video.loop = true;
            video.muted = true;
            video.playsInline = true;
            
            bg.appendChild(video);
            this.currentVideo = video;
            
            video.style.opacity = '0';
            video.addEventListener('loadeddata', () => {
                setTimeout(() => {
                    video.style.opacity = '1';
                }, 100);
            });
        } else {
            if (this.currentVideo) {
                this.currentVideo.pause();
                this.currentVideo.remove();
                this.currentVideo = null;
            }
            
            bg.style.backgroundImage = `url('images/${soundType}.jpeg')`;
        }
    }
    
    setImmersiveAnimations(soundType) {
        const animLayer = document.getElementById('immersive-animation');
        animLayer.innerHTML = '';
        
        // Keep subtle background animations
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
                this.isVideoMode = !this.isVideoMode;
                
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
    
    // Interactive Games
    startGame(soundType) {
        this.gameActive = true;
        this.score = 0;
        this.gameElements = [];
        
        const scoreDisplay = document.getElementById('score-display');
        if (scoreDisplay) {
            scoreDisplay.classList.remove('hidden');
        }
        
        this.updateScore();
        
        // Start game loop
        this.gameLoop();
        
        // Spawn elements periodically
        this.spawnInterval = setInterval(() => {
            this.spawnGameElement(soundType);
        }, 2000); // Spawn every 2 seconds
    }
    
    stopGame() {
        this.gameActive = false;
        
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        if (this.spawnInterval) {
            clearInterval(this.spawnInterval);
        }
        
        this.gameElements = [];
        this.score = 0;
        
        const scoreDisplay = document.getElementById('score-display');
        if (scoreDisplay) {
            scoreDisplay.classList.add('hidden');
        }
        
        // Clear canvas
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    
    spawnGameElement(soundType) {
        if (!this.gameActive || !this.canvas) return;
        
        const element = {
            type: soundType,
            x: Math.random() * this.canvas.width,
            y: -50,
            size: 20 + Math.random() * 15,
            speed: 1 + Math.random() * 2,
            emoji: this.getEmojiForSound(soundType)
        };
        
        // Ocean bubbles float up
        if (soundType === 'ocean') {
            element.y = this.canvas.height + 50;
            element.speed = -element.speed;
        }
        
        // Campfire sparks float up (like bubbles)
        if (soundType === 'campfire') {
            element.y = this.canvas.height + 50;
            element.speed = -(1.5 + Math.random() * 2);
            element.twinkle = Math.random() * Math.PI * 2;
        }
        
        // Wind clouds drift horizontally
        if (soundType === 'wind') {
            element.y = Math.random() * this.canvas.height;
            element.vx = 1 + Math.random();
            element.vy = (Math.random() - 0.5) * 0.5;
        }
        
        // Waterfall droplets fall faster
        if (soundType === 'waterfall') {
            element.speed = 2 + Math.random() * 3;
        }
        
        this.gameElements.push(element);
    }
    
    getEmojiForSound(soundType) {
        const emojis = {
            rain: '💧',
            ocean: '🫧',
            forest: '🍃',
            wind: '☁️',
            campfire: '✨',
            waterfall: '💧'
        };
        return emojis[soundType] || '⭐';
    }
    
    gameLoop() {
        if (!this.gameActive) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw elements
        for (let i = this.gameElements.length - 1; i >= 0; i--) {
            const element = this.gameElements[i];
            
            // Update position
            if (element.type === 'wind') {
                element.x += element.vx;
                element.y += element.vy;
            } else {
                element.y += element.speed;
            }
            
            // Remove if off screen
            if (element.y > this.canvas.height + 50 || 
                element.y < -50 || 
                element.x > this.canvas.width + 50) {
                this.gameElements.splice(i, 1);
                continue;
            }
            
            // Draw element
            this.ctx.font = `${element.size}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(element.emoji, element.x, element.y);
        }
        
        this.animationFrame = requestAnimationFrame(() => this.gameLoop());
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
