// ============================================
// FUNCIONALIDAD DE CARRUSELES
// Sistema modular y escalable para múltiples carruseles
// ============================================

class Carrusel {
    constructor(config) {
        this.container = document.querySelector(config.containerSelector);
        this.track = document.querySelector(config.trackSelector);
        this.dotsContainer = document.querySelector(config.dotsSelector);
        this.items = document.querySelectorAll(config.itemSelector);

        // Soporte para múltiples botones prev/next (ej: desktop + móvil)
        this.prevBtns = config.prevBtnSelectors
            ? config.prevBtnSelectors.map(s => document.querySelector(s)).filter(Boolean)
            : (config.prevBtnSelector ? [document.querySelector(config.prevBtnSelector)].filter(Boolean) : []);

        this.nextBtns = config.nextBtnSelectors
            ? config.nextBtnSelectors.map(s => document.querySelector(s)).filter(Boolean)
            : (config.nextBtnSelector ? [document.querySelector(config.nextBtnSelector)].filter(Boolean) : []);

        this.currentIndex = 0;
        this.itemsPerView = config.itemsPerView || { mobile: 1, tablet: 2, desktop: 3 };
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

        this.ajustarAnchoItems();
        this.crearDots();
        this.agregarEventos();
        this.actualizarCarrusel();

        if (this.autoplay) {
            this.iniciarAutoplay();
        }
    }

    ajustarAnchoItems() {
        // Necesario para que el track funcione correctamente
        const ipv = this.getItemsPerView();
        this.items.forEach(item => {
            item.style.width = `${100 / ipv}%`;
        });
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
        const ipv = this.getItemsPerView();

        // Asegurar ancho correcto en resize
        this.items.forEach(item => {
            item.style.width = `${100 / ipv}%`;
        });

        const translateX = -(this.currentIndex * (100 / ipv));
        this.track.style.transform = `translateX(${translateX}%)`;

        // Actualizar dots
        if (this.dotsContainer) {
            const dots = this.dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('activo', index === this.currentIndex);
            });
        }

        this.actualizarBotones();
    }

    actualizarBotones() {
        const totalSlides = this.getTotalSlides();
        const isFirst = this.currentIndex === 0;
        const isLast = this.currentIndex >= totalSlides - 1;

        this.prevBtns.forEach(btn => {
            if (btn) btn.disabled = isFirst;
        });
        this.nextBtns.forEach(btn => {
            if (btn) btn.disabled = isLast;
        });
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
        this.prevBtns.forEach(btn => {
            if (btn) btn.addEventListener('click', (e) => { e.preventDefault(); this.anterior(); });
        });
        this.nextBtns.forEach(btn => {
            if (btn) btn.addEventListener('click', (e) => { e.preventDefault(); this.siguiente(); });
        });

        if (this.track) {
            this.track.addEventListener('touchstart', (e) => this.handleSwipeStart(e), { passive: true });
            this.track.addEventListener('touchend', (e) => this.handleSwipeEnd(e), { passive: true });
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
        if (Math.abs(diff) > 30) {
            diff > 0 ? this.siguiente() : this.anterior();
        } else {
            this.reanudarAutoplay();
        }
    }

    iniciarAutoplay() {
        this.autoplayTimer = setInterval(() => {
            const totalSlides = this.getTotalSlides();
            this.currentIndex = this.currentIndex >= totalSlides - 1 ? 0 : this.currentIndex + 1;
            this.actualizarCarrusel();
        }, this.autoplayInterval);
    }

    pausarAutoplay() { clearInterval(this.autoplayTimer); }

    reanudarAutoplay() { if (this.autoplay) this.iniciarAutoplay(); }

    reiniciarAutoplay() {
        if (this.autoplay) {
            this.pausarAutoplay();
            this.iniciarAutoplay();
        }
    }

    destruir() { this.pausarAutoplay(); }
}

// ============================================
// MODAL DE VIDEOS
// ============================================

function inicializarVideoModal() {
    if (!document.getElementById('videoModal')) {
        const modal = document.createElement('div');
        modal.id = 'videoModal';
        modal.className = 'video-modal';
        modal.innerHTML = `
            <div class="video-modal-content">
                <button class="video-modal-close">&times;</button>
                <video id="videoModalPlayer" controls style="width:100%;height:100%;">
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
            .video-modal { display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.95); z-index:9999; }
            .video-modal.activo { display:flex; align-items:center; justify-content:center; }
            .video-modal-content { position:relative; width:90%; height:90%; max-width:1200px; max-height:700px; background:#000; border-radius:10px; overflow:hidden; }
            .video-modal-close { position:absolute; top:15px; right:15px; background:rgba(255,255,255,0.9); border:none; color:#000; font-size:32px; cursor:pointer; width:45px; height:45px; border-radius:50%; display:flex; align-items:center; justify-content:center; z-index:10000; transition:all 0.3s ease; }
            .video-modal-close:hover { background:#fff; transform:scale(1.1); }
            @media (max-width:768px) { .video-modal-content { width:95%; height:95%; max-height:500px; } }
        `;
        document.head.appendChild(styles);
    }

    const modal = document.getElementById('videoModal');
    const closeBtn = document.querySelector('.video-modal-close');
    closeBtn.addEventListener('click', cerrarVideoModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) cerrarVideoModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('activo')) cerrarVideoModal(); });
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
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    console.log('🎠 Carruseles cargados');

    inicializarVideoModal();

    const videos = document.querySelectorAll('.video-placeholder video');
    videos.forEach(video => {
        video.style.cursor = 'pointer';
        video.addEventListener('click', () => {
            const src = video.querySelector('source').src;
            abrirVideoModal(src);
        });
    });

    // Carrusel Casos de Éxito
    // prevBtnSelectors acepta múltiples botones (desktop + móvil)
    new Carrusel({
        containerSelector: '.casos-carrusel-container',
        trackSelector: '.casos-track',
        prevBtnSelectors: ['.casos-prev', '.casos-prev-mobile'],
        nextBtnSelectors: ['.casos-next', '.casos-next-mobile'],
        dotsSelector: '.casos-dots',
        itemSelector: '.caso-card',
        itemsPerView: { mobile: 1, tablet: 1, desktop: 1 },
        autoplay: true,
        autoplayInterval: 6000
    });

    // Carrusel Testimonios
    new Carrusel({
        containerSelector: '.testimonios-carrusel-container',
        trackSelector: '.testimonios-track',
        prevBtnSelectors: ['.testimonios-prev', '.testimonios-prev-bottom'],
        nextBtnSelectors: ['.testimonios-next', '.testimonios-next-bottom'],
        dotsSelector: '.testimonios-dots',
        itemSelector: '.testimonio-card',
        itemsPerView: { mobile: 1, tablet: 2, desktop: 3 },
        autoplay: true,
        autoplayInterval: 5000
    });

    // Carrusel Experiencias
    new Carrusel({
        containerSelector: '.experiencias-carrusel-container',
        trackSelector: '.experiencias-track',
        prevBtnSelectors: ['.experiencias-prev'],
        nextBtnSelectors: ['.experiencias-next'],
        dotsSelector: '.experiencias-dots',
        itemSelector: '.experiencia-card',
        itemsPerView: { mobile: 1, tablet: 1, desktop: 1 },
        autoplay: true,
        autoplayInterval: 5000
    });

    console.log('✅ Carruseles funcionando correctamente');
});
