class ServerManager {
    constructor() {
        this.config = window.CONFIG || {};
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupMobileFeatures();
        this.setupVideoBackground();
    }
    
    setupEventListeners() {
        // Play button
        const playButton = document.getElementById('play-button');
        if (playButton) {
            playButton.addEventListener('click', () => this.openModal());
            if (this.isMobile) {
                playButton.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.openModal();
                }, { passive: false });
            }
        }
        
        // Modal close
        const modalClose = document.getElementById('modal-close');
        const modalCloseBtn = document.getElementById('modal-close-btn');
        const modalOverlay = document.getElementById('modal-overlay');
        
        [modalClose, modalCloseBtn].forEach(btn => {
            if (btn) btn.addEventListener('click', () => this.closeModal());
        });
        
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) this.closeModal();
            });
        }
        
        // Copy buttons
        document.querySelectorAll('.copy-ip-btn, .copy-address-btn').forEach(button => {
            const text = button.getAttribute('data-clipboard-text') || 
                        button.getAttribute('data-address') ||
                        this.config.serverAddress;
            if (text) {
                button.addEventListener('click', () => this.copyToClipboard(text, button));
            }
        });
        
        // Address click to copy
        const serverIP = document.querySelector('.server-ip');
        if (serverIP) {
            serverIP.addEventListener('click', () => {
                this.copyToClipboard(this.config.serverAddress, 
                    document.querySelector('.copy-ip-btn'));
            });
        }
        
        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });
    }
    
    setupMobileFeatures() {
        if (!this.isMobile) return;
        
        // Fix viewport height
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        setVH();
        window.addEventListener('resize', setVH);
        window.addEventListener('orientationchange', setVH);
        
        // Prevent zoom on double tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, { passive: false });
        
        // Prevent video playback issues on mobile
        this.handleMobileVideo();
    }
    
    setupVideoBackground() {
        const video = document.querySelector('.video-bg video');
        if (!video) return;
        
        // Try to play video
        video.play().catch(error => {
            console.log('Video autoplay failed:', error);
            // Show fallback
            const fallback = document.querySelector('.video-fallback');
            if (fallback) {
                fallback.style.display = 'block';
            }
        });
        
        // Mute video for autoplay compliance
        video.muted = true;
        
        // Add loaded event
        video.addEventListener('loadeddata', () => {
            console.log('Background video loaded successfully');
        });
        
        // Add error handling
        video.addEventListener('error', (e) => {
            console.error('Video error:', e);
            const fallback = document.querySelector('.video-fallback');
            if (fallback) {
                fallback.style.display = 'block';
            }
        });
    }
    
    handleMobileVideo() {
        if (!this.isMobile) return;
        
        const video = document.querySelector('.video-bg video');
        if (!video) return;
        
        // Pause video when page is not visible (to save battery)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                video.pause();
            } else {
                video.play().catch(() => {});
            }
        });
    }
    
    openModal() {
        const modal = document.getElementById('modal-overlay');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    closeModal() {
        const modal = document.getElementById('modal-overlay');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
    
    async copyToClipboard(text, button) {
        if (!text) return;
        
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
            
            // Visual feedback
            if (button) {
                const originalHTML = button.innerHTML;
                const originalText = button.textContent;
                
                if (button.classList.contains('copy-ip-btn') || button.classList.contains('copy-address-btn')) {
                    button.innerHTML = '<i class="fas fa-check"></i> COPIED!';
                    button.style.background = '#00c853';
                }
                
                setTimeout(() => {
                    button.innerHTML = originalHTML;
                    button.style.background = '';
                }, 2000);
            }
            
            this.showNotification('Server address copied successfully!', 'success');
            
        } catch (error) {
            console.error('Copy failed:', error);
            this.showNotification('Failed to copy address', 'error');
        }
    }
    
    showNotification(message, type = 'info') {
        document.querySelectorAll('.notification').forEach(el => el.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
        notification.innerHTML = `<i class="fas fa-${icon}"></i><span>${message}</span>`;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        try {
            window.serverManager = new ServerManager();
            
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 100);
            
        } catch (error) {
            console.error('Failed to initialize:', error);
            document.body.style.opacity = '1';
        }
    }, 50);
});