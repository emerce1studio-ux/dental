// ============================================
// ANIMACIÓN DE NÚMEROS (CONTADORES)
// ============================================

/**
 * Animar números en la sección de estadísticas
 */
function animarContadores() {
    const contadores = document.querySelectorAll('.contador');
    let contadoresAnimados = false;

    const opciones = {
        threshold: 0.5
    };

    const observador = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !contadoresAnimados) {
                contadores.forEach(contador => {
                    const numeroFinal = parseInt(contador.getAttribute('data-numero'));
                    animarNumero(contador, numeroFinal, 2000);
                });
                contadoresAnimados = true;
                observador.unobserve(entry.target);
            }
        });
    }, opciones);

    // Observar la primera tarjeta de estadísticas
    const primerCard = document.querySelector('.estadistica-card');
    if (primerCard) {
        observador.observe(primerCard);
    }
}

/**
 * Función auxiliar para animar un número
 */
function animarNumero(elemento, numeroFinal, duracion = 2000) {
    let numeroActual = 0;
    const incremento = numeroFinal / (duracion / 16);
    
    const interval = setInterval(() => {
        numeroActual += incremento;
        if (numeroActual >= numeroFinal) {
            elemento.textContent = numeroFinal;
            clearInterval(interval);
        } else {
            elemento.textContent = Math.floor(numeroActual);
        }
    }, 16);
}

// ============================================
// ACORDEÓN FAQ INTERACTIVO
// ============================================

/**
 * Inicializar funcionamiento del acordeón FAQ
 */
function inicializarFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const titulo = item.querySelector('.faq-titulo');
        
        titulo.addEventListener('click', () => {
            // Cerrar otros items
            faqItems.forEach(otroItem => {
                if (otroItem !== item) {
                    otroItem.classList.remove('activo');
                }
            });

            // Toggle del item actual
            item.classList.toggle('activo');
        });
    });

    // Abrir el primer item por defecto
    if (faqItems.length > 0) {
        faqItems[0].classList.add('activo');
    }
}

// ============================================
// ANIMACIONES AL SCROLLEAR (MEJORADO)
// ============================================

/**
 * Crear observador para elementos con scroll
 */
function crearObservadorAvanzado() {
    const opciones = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observador = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Agregar clase para animaciones
                if (!entry.target.classList.contains('animado')) {
                    entry.target.classList.add('animado');
                }
            }
        });
    }, opciones);

    // Observar tarjetas de estadísticas
    document.querySelectorAll('.estadistica-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observador.observe(card);
    });

    // Observar items del FAQ
    document.querySelectorAll('.faq-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observador.observe(item);
    });

    // Observar otras tarjetas
    document.querySelectorAll('.servicio-card, .porqueelejiros-card, .horario-card').forEach(card => {
        if (!card.style.opacity) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observador.observe(card);
        }
    });
}

// ============================================
// PARALLAX SUAVE AL SCROLLEAR
// ============================================

/**
 * Efecto parallax ligero en secciones
 */
function inicializarParallax() {
    const heroSection = document.querySelector('.hero');
    
    window.addEventListener('scroll', () => {
        if (heroSection) {
            const scrollPosition = window.scrollY;
            heroSection.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
        }
    });
}

// ============================================
// MEJORAR NAVBAR AL SCROLLEAR
// ============================================

/**
 * Efecto mejorado del navbar al scrollear
 */
function mejorarNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        let scrollTop = window.scrollY;

        // Agregar sombra al scrollear
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
}

// ============================================
// INICIALIZAR TODO
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🦷 Cargando nuevas funcionalidades...');

    // Animación de contadores
    animarContadores();

    // FAQ interactivo
    inicializarFAQ();

    // Observador avanzado
    crearObservadorAvanzado();

    // Parallax
    inicializarParallax();

    // Navbar mejorado
    mejorarNavbarScroll();

    console.log('✅ Nuevas funcionalidades cargadas correctamente');
});