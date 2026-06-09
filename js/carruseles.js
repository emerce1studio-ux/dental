// ============================================
// FUNCIONALIDAD DE CARRUSELES
// Sistema modular y escalable para múltiples carruseles
// ============================================

class Carrusel {
    constructor(config) {
        this.container = document.querySelector(config.containerSelector);
        this.track = document.querySelector(config.trackSelector);
        this.prevBtn = document.querySelector(config.prevBtnSelector);
        this.nextBtn = document.querySelector(config.nextBtnSelector);
        this.dotsContainer = document.querySelector(config.dotsSelector);
        this.items = document.querySelectorAll(config.itemSelector);
        
        this.currentIndex = 0;
        this.itemsPerView = config.itemsPerView || {
            mobile: 1,
            tablet: 2,
            desktop: 3
        };
        this.autoplay = config.autoplay !== false;
        this.autoplayInterval = config.autoplayInterval || 5000;
        this.autoplayTimer = null;
        this.isSwiping = false;
        this.swipeStartX = 0;
        this.swipeEndX = 0;
        
        this.init();
    }

    init() {
        if (!this.container || !this.track || this.items.length === 0) {
            console.warn('Carrusel no configurado correctamente');
            return;
        }

        this.crearDots();
        this.agregarEventos();
        this.actualizarCarrusel();
        
        if (this.autoplay && window.innerWidth >= 768) {
            this.iniciarAutoplay();
        }
    }

    getItemsPerView() {
        const width = window.innerWidth;
        if (width < 768) return this.itemsPerView.mobile;
        if (width < 1024) return this.itemsPerView.tablet;
        return this.itemsPerView.desktop;
    }

    getTotalSlides() {
        return Math.ceil(this.items.length / this.getItemsPerView());
    }

    crearDots() {
        if (!this.dotsContainer) return;
        
        this.dotsContainer.innerHTML = '';
        const totalSlides = this.getTotalSlides();
        
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            if (i === 0) dot.classList.add('activo');
            dot.addEventListener('click', () => this.irASlide(i));
            this.dotsContainer.appendChild(dot);
        }
    }

    actualizarCarrusel() {
        const itemsPerView = this.getItemsPerView();
        const translateX = -(this.currentIndex * 100 / itemsPerView);
        
        this.track.style.transform = `translateX(${translateX}%)`;
        
        // Actualizar dots
        if (this.dotsContainer) {
            const dots = this.dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                if (index === this.currentIndex) {
                    dot.classList.add('activo');
                } else {
                    dot.classList.remove('activo');
                }
            });
        }
        
        this.actualizarBotones();
    }

    actualizarBotones() {
        const totalSlides = this.getTotalSlides();
        
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentIndex === 0;
        }
        
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentIndex >= totalSlides - 1;
        }
    }

    anterior() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.actualizarCarrusel();
            this.reiniciarAutoplay();
        }
    }

    siguiente() {
        const totalSlides = this.getTotalSlides();
        if (this.currentIndex < totalSlides - 1) {
            this.currentIndex++;
            this.actualizarCarrusel();
            this.reiniciarAutoplay();
        }
    }

    irASlide(index) {
        this.currentIndex = Math.max(0, Math.min(index, this.getTotalSlides() - 1));
        this.actualizarCarrusel();
        this.reiniciarAutoplay();
    }

    agregarEventos() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.anterior());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.siguiente());
        }

        if (this.track) {
            this.track.addEventListener('touchstart', (e) => this.handleSwipeStart(e), false);
            this.track.addEventListener('touchend', (e) => this.handleSwipeEnd(e), false);
        }

        if (this.container) {
            this.container.addEventListener('mouseenter', () => this.pausarAutoplay());
            this.container.addEventListener('mouseleave', () => this.reanudarAutoplay());
        }

        window.addEventListener('resize', () => {
            this.crearDots();
            this.actualizarCarrusel();
        });
    }

    handleSwipeStart(e) {
        this.isSwiping = true;
        this.swipeStartX = e.touches[0].clientX;
        this.pausarAutoplay();
    }

    handleSwipeEnd(e) {
        if (!this.isSwiping) return;
        this.isSwiping = false;
        this.swipeEndX = e.changedTouches[0].clientX;

        const diff = this.swipeStartX - this.swipeEndX;
        const threshold = 40;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.siguiente();
            } else {
                this.anterior();
            }
        } else {
            this.reanudarAutoplay();
        }
    }

    iniciarAutoplay() {
        if (window.innerWidth < 768) return;
        
        this.autoplayTimer = setInterval(() => {
            const totalSlides = this.getTotalSlides();
            if (this.currentIndex >= totalSlides - 1) {
                this.currentIndex = 0;
            } else {
                this.currentIndex++;
            }
            this.actualizarCarrusel();
        }, this.autoplayInterval);
    }

    pausarAutoplay() {
        clearInterval(this.autoplayTimer);
    }

    reanudarAutoplay() {
        if (this.autoplay && window.innerWidth >= 768) {
            this.iniciarAutoplay();
        }
    }

    reiniciarAutoplay() {
        if (this.autoplay && window.innerWidth >= 768) {
            this.pausarAutoplay();
            this.iniciarAutoplay();
        }
    }

    destruir() {
        this.pausarAutoplay();
    }
}

// ============================================
// FUNCIONALIDAD PARA MODAL DE VIDEOS
// ============================================

function inicializarVideoModal() {
    if (!document.getElementById('videoModal')) {
        const modal = document.createElement('div');
        modal.id = 'videoModal';
        modal.className = 'video-modal';
        modal.innerHTML = `
            <div class="video-modal-content">
                <button class="video-modal-close">&times;</button>
                <video id="videoModalPlayer" controls style="width: 100%; height: 100%;">
                    Tu navegador no soporta videos
                </video>
            </div>
        `;
        document.body.appendChild(modal);
    }

    if (!document.getElementById('videoModalStyles')) {
        const styles = document.createElement('style');
        styles.id = 'videoModalStyles';
        styles.innerHTML = `
            .video-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.95);
                z-index: 9999;
                animation: fadeIn 0.3s ease;
            }

            .video-modal.activo {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .video-modal-content {
                position: relative;
                width: 90%;
                height: 90%;
                max-width: 1200px;
                max-height: 700px;
                background: #000;
                border-radius: 10px;
                overflow: hidden;
            }

            .video-modal-close {
                position: absolute;
                top: 15px;
                right: 15px;
                background: rgba(255, 255, 255, 0.9);
                border: none;
                color: #000;
                font-size: 32px;
                cursor: pointer;
                width: 45px;
                height: 45px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                transition: all 0.3s ease;
            }

            .video-modal-close:hover {
                background: rgba(255, 255, 255, 1);
                transform: scale(1.1);
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @media (max-width: 768px) {
                .video-modal-content {
                    width: 95%;
                    height: 95%;
                    max-height: 500px;
                }

                .video-modal-close {
                    top: 10px;
                    right: 10px;
                    font-size: 28px;
                    width: 40px;
                    height: 40px;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    const modal = document.getElementById('videoModal');
    const closeBtn = document.querySelector('.video-modal-close');

    closeBtn.addEventListener('click', cerrarVideoModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            cerrarVideoModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('activo')) {
            cerrarVideoModal();
        }
    });
}

function abrirVideoModal(videoSrc) {
    const modal = document.getElementById('videoModal');
    const videoPlayer = document.getElementById('videoModalPlayer');
    
    videoPlayer.src = videoSrc;
    modal.classList.add('activo');
    videoPlayer.play();
}

function cerrarVideoModal() {
    const modal = document.getElementById('videoModal');
    const videoPlayer = document.getElementById('videoModalPlayer');
    
    videoPlayer.pause();
    videoPlayer.src = '';
    modal.classList.remove('activo');
}

// ============================================
// INICIALIZACIÓN DE CARRUSELES
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎠 Carruseles cargados');

    inicializarVideoModal();

    const videos = document.querySelectorAll('.video-placeholder video');
    videos.forEach(video => {
        video.style.cursor = 'pointer';
        video.addEventListener('click', () => {
            const videoSrc = video.querySelector('source').src;
            abrirVideoModal(videoSrc);
        });
    });

    const casoExitoCarrusel = new Carrusel({
        containerSelector: '.casos-carrusel-container',
        trackSelector: '.casos-track',
        prevBtnSelector: '.casos-prev',
        nextBtnSelector: '.casos-next',
        dotsSelector: '.casos-dots',
        itemSelector: '.caso-card',
        itemsPerView: {
            mobile: 1,
            tablet: 1,
            desktop: 1
        },
        autoplay: true,
        autoplayInterval: 6000
    });

    const testimoniosCarrusel = new Carrusel({
        containerSelector: '.testimonios-carrusel-container',
        trackSelector: '.testimonios-track',
        prevBtnSelector: '.testimonios-prev',
        nextBtnSelector: '.testimonios-next',
        dotsSelector: '.testimonios-dots',
        itemSelector: '.testimonio-card',
        itemsPerView: {
            mobile: 1,
            tablet: 2,
            desktop: 3
        },
        autoplay: true,
        autoplayInterval: 5000
    });

    const experienciasCarrusel = new Carrusel({
        containerSelector: '.experiencias-carrusel-container',
        trackSelector: '.experiencias-track',
        prevBtnSelector: '.experiencias-prev',
        nextBtnSelector: '.experiencias-next',
        dotsSelector: '.experiencias-dots',
        itemSelector: '.experiencia-card',
        itemsPerView: {
            mobile: 1,
            tablet: 1,
            desktop: 1
        },
        autoplay: true,
        autoplayInterval: 5000
    });

    console.log('✅ Carruseles funcionando correctamente');
});