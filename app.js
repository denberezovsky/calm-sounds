// Calming Sounds App with Category Navigation
class CalmSoundsApp {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'he';
        this.currentCategory = null;
        this.sounds = {};
        this.initSounds();
        
        this.currentSound = null;
        this.isVideoMode = false;
        this.currentVideo = null;
        
        this.gameActive = false;
        this.score = 0;
        this.gameElements = [];
        this.canvas = null;
        this.ctx = null;
        this.animationFrame = null;
        
        this.init();
    }
    
    initSounds() {
        const allSounds = ['rain', 'ocean', 'forest', 'wind', 'campfire', 'waterfall',
                          'birds', 'cat', 'frogs', 'owl', 'whales', 'dog',
                          'piano', 'guitar', 'musicbox', 'harp', 'flute', 'chimes'];
        allSounds.forEach(sound => {
            this.sounds[sound] = document.getElementById(`${sound}-audio`);
        });
    }
    
    init() {
        this.setupLanguage();
        this.setupCategoryCards();
        this.setupLanguageSelectors();
        this.setupBackButtons();
        this.setupSwipeGesture();
        this.setupCanvas();
        this.setupServiceWorker();
        this.setVolume(0.7);
    }
    
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
    
    setupLanguageSelectors() {
        ['lang-button', 'lang-button-sounds', 'lang-button-immersive'].forEach(btnId => {
            const btn = document.getElementById(btnId);
            const menuId = btnId.replace('button', 'menu');
            const menu = document.getElementById(menuId);
            
            if (btn && menu) {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    menu.classList.toggle('hidden');
                });
                
                menu.querySelectorAll('.lang-option').forEach(opt => {
                    opt.addEventListener('click', () => {
                        const lang = opt.getAttribute('data-lang');
                        this.applyLanguage(lang);
                        document.querySelectorAll('.lang-menu').forEach(m => m.classList.add('hidden'));
                    });
                });
            }
        });
        
        document.addEventListener('click', () => {
            document.querySelectorAll('.lang-menu').forEach(m => m.classList.add('hidden'));
        });
    }
    
    setupCategoryCards() {
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                const category = card.dataset.category;
                this.openCategory(category);
            });
        });
    }
    
    openCategory(category) {
        this.currentCategory = category;
        
        // Hide category view, show sounds view
        document.getElementById('category-view').classList.add('hidden');
        document.getElementById('sounds-view').classList.remove('hidden');
        
        // Update title
        const titleEl = document.getElementById('current-category-title');
        const categoryKey = category;
        titleEl.textContent = '🌿🦜🎵'[{nature:0,animals:1,music:2}[category]] + ' ' + 
                             translations[this.currentLang][categoryKey];
        
        // Populate sound grid
        this.populateSoundGrid(category);
    }
    
    populateSoundGrid(category) {
        const grid = document.getElementById('sound-grid');
        grid.innerHTML = '';
        
        const sounds = soundsByCategory[category];
        sounds.forEach(soundType => {
            const card = document.createElement('div');
            card.className = `sound-card ${soundType}`;
            card.dataset.sound = soundType;
            
            const icon = this.getSoundIcon(soundType);
            const name = translations[this.currentLang][soundType];
            
            card.innerHTML = `
                <div class="card-content">
                    <div class="icon">${icon}</div>
                    <h3>${name}</h3>
                </div>
            `;
            
            card.addEventListener('click', () => {
                this.playSoundVoice(soundType);
                setTimeout(() => this.openImmersiveMode(soundType), 300);
            });
            
            grid.appendChild(card);
        });
    }
    
    getSoundIcon(sound) {
        const icons = {
            rain: '🌧️', ocean: '🌊', forest: '🌲', wind: '🌬️', campfire: '🔥', waterfall: '💦',
            birds: '🐦', cat: '🐱', frogs: '🐸', owl: '🦉', whales: '🐋', dog: '🐕',
            piano: '🎹', guitar: '🎸', musicbox: '🎼', harp: '🪕', flute: '🎺', chimes: '🔔'
        };
        return icons[sound] || '⭐';
    }
    
    playSoundVoice(soundType) {
        const voiceId = `voice-${soundType}-${this.currentLang}`;
        const voiceAudio = document.getElementById(voiceId);
        if (!voiceAudio) {
            const audio = new Audio(`voices/voice-${soundType}-${this.currentLang}.mp3`);
            audio.play().catch(e => console.log('Voice error:', e));
        } else {
            voiceAudio.currentTime = 0;
            voiceAudio.play().catch(e => console.log('Voice error:', e));
        }
    }
    
    setupBackButtons() {
        // Back from sounds to categories
        document.getElementById('back-to-categories').addEventListener('click', () => {
            document.getElementById('sounds-view').classList.add('hidden');
            document.getElementById('category-view').classList.remove('hidden');
        });
        
        // Back from immersive to sounds
        document.getElementById('back-button').addEventListener('click', () => {
            this.closeImmersiveMode();
        });
    }
    
    openImmersiveMode(soundType) {
        this.currentSound = soundType;
        this.isVideoMode = false;
        
        document.getElementById('sounds-view').classList.add('hidden');
        document.getElementById('immersive-view').classList.remove('hidden');
        
        this.playSound(soundType);
        this.setImmersiveBackground(soundType, false);
        this.resizeCanvas();
        this.startGame(soundType);
    }
    
    closeImmersiveMode() {
        if (this.currentSound) {
            this.stopSound(this.currentSound);
        }
        if (this.currentVideo) {
            this.currentVideo.pause();
            this.currentVideo.remove();
            this.currentVideo = null;
        }
        
        this.stopGame();
        
        document.getElementById('immersive-view').classList.add('hidden');
        document.getElementById('sounds-view').classList.remove('hidden');
        
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
                setTimeout(() => video.style.opacity = '1', 100);
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
    
    setupSwipeGesture() {
        const content = document.querySelector('.immersive-content');
        let touchStartX = 0;
        
        content.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        content.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const diff = Math.abs(touchStartX - touchEndX);
            
            if (diff > 50 && this.currentSound) {
                this.isVideoMode = !this.isVideoMode;
                const bg = document.getElementById('immersive-bg');
                bg.style.opacity = '0';
                setTimeout(() => {
                    this.setImmersiveBackground(this.currentSound, this.isVideoMode);
                    setTimeout(() => bg.style.opacity = '1', 100);
                }, 300);
            }
        });
    }
    
    // Canvas and game functions
    setupCanvas() {
        this.canvas = document.getElementById('game-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.canvas.style.pointerEvents = 'auto';
        
        this.canvas.addEventListener('click', (e) => this.handleGameClick(e));
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const touch = e.changedTouches[0];
            const rect = this.canvas.getBoundingClientRect();
            this.handleGameClick({
                clientX: touch.clientX,
                clientY: touch.clientY
            });
        });
    }
    
    resizeCanvas() {
        if (!this.canvas) return;
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }
    
    handleGameClick(e) {
        if (!this.gameActive) return;
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        for (let i = this.gameElements.length - 1; i >= 0; i--) {
            const el = this.gameElements[i];
            const dist = Math.sqrt((x - el.x) ** 2 + (y - el.y) ** 2);
            if (dist < el.size) {
                this.catchElement(i);
                break;
            }
        }
    }
    
    catchElement(index) {
        const element = this.gameElements[index];
        this.createCelebration(element.x, element.y, element.type);
        this.gameElements.splice(index, 1);
        this.score++;
        this.updateScore();
    }
    
    createCelebration(x, y, soundType) {
        // Determine category for celebration type
        const natureSounds = ['rain', 'ocean', 'forest', 'wind', 'campfire', 'waterfall'];
        const animalSounds = ['birds', 'cat', 'frogs', 'owl', 'whales', 'dog'];
        const musicSounds = ['piano', 'guitar', 'musicbox', 'harp', 'flute', 'chimes'];
        
        let celebrationType;
        if (natureSounds.includes(soundType)) {
            celebrationType = 'stars';  // ✨ Star burst for Nature
        } else if (animalSounds.includes(soundType)) {
            celebrationType = 'fireworks';  // 🎆 Fireworks for Animals
        } else if (musicSounds.includes(soundType)) {
            celebrationType = 'confetti';  // 🎊 Confetti for Music
        }
        
        // Create particles based on type
        const particleCount = 12;
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = 3 + Math.random() * 3;
            
            const particle = {
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1.0,
                type: celebrationType,
                size: 8 + Math.random() * 8,
                color: this.getParticleColor(celebrationType, i)
            };
            
            if (!this.particles) this.particles = [];
            this.particles.push(particle);
        }
        
        // Play celebration sound
        this.playCelebrationSound(celebrationType);
    }
    
    getParticleColor(type, index) {
        if (type === 'stars') {
            // Gold/yellow stars
            return ['#FFD700', '#FFA500', '#FFFF00', '#FFE135'][index % 4];
        } else if (type === 'fireworks') {
            // Colorful fireworks
            return ['#FF6B9D', '#C86DD7', '#667eea', '#4facfe', '#00f2fe', '#FFB75E'][index % 6];
        } else if (type === 'confetti') {
            // Rainbow confetti
            return ['#FF6B9D', '#FFB75E', '#FFD700', '#4AC29A', '#667DB6', '#C86DD7'][index % 6];
        }
    }
    
    playCelebrationSound(type) {
        // Create simple celebration sounds
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        if (type === 'stars') {
            // Gentle "ting!"
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
        } else if (type === 'fireworks') {
            // Fun "pop!"
            oscillator.frequency.value = 600;
            oscillator.type = 'square';
        } else if (type === 'confetti') {
            // Musical "chime!"
            oscillator.frequency.value = 1000;
            oscillator.type = 'triangle';
        }
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    }
    
    updateScore() {
        // Score counter removed for better ASD experience
        // Just visual feedback, no pressure from numbers
    }
    
    startGame(soundType) {
        this.gameActive = true;
        this.score = 0;
        this.gameElements = [];
        this.updateScore();
        this.gameLoop();
        this.spawnInterval = setInterval(() => this.spawnGameElement(soundType), 2000);
    }
    
    stopGame() {
        this.gameActive = false;
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
        if (this.spawnInterval) clearInterval(this.spawnInterval);
        this.gameElements = [];
        this.score = 0;
        const display = document.getElementById('score-display');
        if (display) display.classList.add('hidden');
        if (this.ctx) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    spawnGameElement(soundType) {
        if (!this.gameActive || !this.canvas) return;
        const element = {
            type: soundType,
            x: Math.random() * this.canvas.width,
            y: -50,
            size: 40 + Math.random() * 20,  // Bigger: 40-60px (was 20-35px)
            speed: 1 + Math.random() * 2,
            emoji: this.getEmojiForSound(soundType)
        };
        
        if (['ocean', 'campfire'].includes(soundType)) {
            element.y = this.canvas.height + 50;
            element.speed = -element.speed;
        }
        if (['wind', 'birds'].includes(soundType)) {
            element.y = Math.random() * this.canvas.height;
            element.vx = 1 + Math.random();
            element.vy = (Math.random() - 0.5) * 0.5;
        }
        if (['waterfall'].includes(soundType)) {
            element.speed = 2 + Math.random() * 3;
        }
        if (['owl', 'harp', 'flute', 'chimes'].includes(soundType)) {
            element.speed = 0.5 + Math.random();
        }
        
        this.gameElements.push(element);
    }
    
    getEmojiForSound(soundType) {
        const emojis = {
            rain: '💧', ocean: '🫧', forest: '🍃', wind: '☁️', campfire: '✨', waterfall: '💧',
            birds: '🐦', cat: '🐾', frogs: '🐸', owl: '🦉', whales: '🐋', dog: '🐾',
            piano: '🎵', guitar: '🎸', musicbox: '✨', harp: '🎶', flute: '🎵', chimes: '🔔'
        };
        return emojis[soundType] || '⭐';
    }
    
    gameLoop() {
        if (!this.gameActive) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw game elements
        for (let i = this.gameElements.length - 1; i >= 0; i--) {
            const el = this.gameElements[i];
            if (el.vx !== undefined) {
                el.x += el.vx;
                el.y += el.vy || 0;
            } else {
                el.y += el.speed;
            }
            
            if (el.y > this.canvas.height + 50 || el.y < -50 || el.x > this.canvas.width + 50) {
                this.gameElements.splice(i, 1);
                continue;
            }
            
            this.ctx.font = `${el.size}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(el.emoji, el.x, el.y);
        }
        
        // Update and draw celebration particles
        if (this.particles) {
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];
                
                // Update particle position
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.2;  // Gravity
                p.life -= 0.02;
                
                // Remove dead particles
                if (p.life <= 0) {
                    this.particles.splice(i, 1);
                    continue;
                }
                
                // Draw particle based on type
                this.ctx.save();
                this.ctx.globalAlpha = p.life;
                this.ctx.fillStyle = p.color;
                
                if (p.type === 'stars') {
                    // Draw star shape
                    this.drawStar(p.x, p.y, p.size);
                } else if (p.type === 'fireworks') {
                    // Draw circle
                    this.ctx.beginPath();
                    this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    this.ctx.fill();
                } else if (p.type === 'confetti') {
                    // Draw rectangle (confetti piece)
                    this.ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size * 1.5);
                }
                
                this.ctx.restore();
            }
        }
        
        this.animationFrame = requestAnimationFrame(() => this.gameLoop());
    }
    
    drawStar(x, y, size) {
        const spikes = 5;
        const outerRadius = size;
        const innerRadius = size / 2;
        
        this.ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (Math.PI * i) / spikes - Math.PI / 2;
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;
            
            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    async playSound(soundType) {
        const audio = this.sounds[soundType];
        try {
            audio.volume = 0;
            await audio.play();
            await this.fadeIn(audio);
        } catch (e) {
            console.error('Play error:', e);
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
            if (audio) audio.volume = volume;
        });
    }
    
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js')
                .then(reg => console.log('SW registered:', reg))
                .catch(err => console.log('SW registration failed:', err));
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new CalmSoundsApp());
} else {
    new CalmSoundsApp();
}

let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);
