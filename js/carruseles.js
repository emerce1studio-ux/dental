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
        this.autoplay = config.autoplay !== false; // Por defecto: true
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
        
        if (this.autoplay) {
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
        
        // Actualizar estado de botones
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
        // Botones de navegación
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.anterior());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.siguiente());
        }

        // Soporte táctil (swipe)
        if (this.track) {
            this.track.addEventListener('touchstart', (e) => this.handleSwipeStart(e), false);
            this.track.addEventListener('touchend', (e) => this.handleSwipeEnd(e), false);
            this.track.addEventListener('touchmove', (e) => this.handleSwipeMove(e), false);
        }

        // Pausar autoplay al hover
        if (this.container) {
            this.container.addEventListener('mouseenter', () => this.pausarAutoplay());
            this.container.addEventListener('mouseleave', () => this.reanudarAutoplay());
        }

        // Recalcular en resize
        window.addEventListener('resize', () => {
            this.crearDots();
            this.actualizarCarrusel();
        });
    }

    handleSwipeStart(e) {
        this.isSwiping = true;
        this.swipeStartX = e.touches[0].clientX;
    }

    handleSwipeMove(e) {
        if (!this.isSwiping) return;
        this.swipeEndX = e.touches[0].clientX;
    }

    handleSwipeEnd(e) {
        if (!this.isSwiping) return;
        this.isSwiping = false;

        const diff = this.swipeStartX - this.swipeEndX;
        const threshold = 50; // Mínimo de píxeles para registrar swipe

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.siguiente(); // Swipe izquierda -> siguiente
            } else {
                this.anterior(); // Swipe derecha -> anterior
            }
        }
    }

    iniciarAutoplay() {
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
        if (this.autoplay) {
            this.iniciarAutoplay();
        }
    }

    reiniciarAutoplay() {
        if (this.autoplay) {
            this.pausarAutoplay();
            this.iniciarAutoplay();
        }
    }

    destruir() {
        this.pausarAutoplay();
        // Aquí puedes limpiar más recursos si es necesario
    }
}

// ============================================
// INICIALIZACIÓN DE CARRUSELES
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎠 Carruseles cargados');

    // Carrusel de Casos de Éxito
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

    // Carrusel de Testimonios
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

    console.log('✅ Carruseles funcionando correctamente');
});