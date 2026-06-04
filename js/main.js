// ============================================
// FUNCIONES GENERALES Y UTILIDADES
// ============================================

/**
 * Animación suave de scroll
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

/**
 * Observador para fade-in al hacer scroll
 */
function crearObservadorElementos() {
    const opciones = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observador = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.6s ease-in forwards';
                observador.unobserve(entry.target);
            }
        });
    }, opciones);

    document.querySelectorAll('.servicio-card').forEach(card => {
        observador.observe(card);
    });

    document.querySelectorAll('.info-item').forEach(item => {
        observador.observe(item);
    });
}

/**
 * Agregar animaciones CSS base
 */
function agregarAnimacionesCSS() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
            from { opacity: 0; transform: translateX(-30px); }
            to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
            from { opacity: 0; transform: translateX(30px); }
            to   { opacity: 1; transform: translateX(0); }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Función para animar un número
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

/**
 * Activar link del navbar según sección visible
 */
function activarNavegacionActiva() {
    const secciones = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar-menu a');

    window.addEventListener('scroll', () => {
        let actual = '';

        secciones.forEach(seccion => {
            if (scrollY >= seccion.offsetTop - 100) {
                actual = seccion.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('activo');
            if (link.getAttribute('href').slice(1) === actual) {
                link.classList.add('activo');
            }
        });
    });
}

/**
 * Mostrar/ocultar botón WhatsApp flotante
 */
function controlarBotonFlotante() {
    const btnFlotante = document.querySelector('.whatsapp-flotante');
    if (!btnFlotante) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btnFlotante.style.opacity = '1';
            btnFlotante.style.visibility = 'visible';
            btnFlotante.style.transition = 'all 0.3s ease-in-out';
        } else {
            btnFlotante.style.opacity = '0';
            btnFlotante.style.visibility = 'hidden';
        }
    });
}

/**
 * Loading Screen
 */
function inicializarLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (!loadingScreen) return;

    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.visibility = 'hidden';
    }, 2000);
}

/**
 * Back to Top Button
 */
function inicializarBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/**
 * Lazy Loading de Imágenes
 */
function inicializarLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '100px' });

        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            img.style.opacity = '1';
            imageObserver.observe(img);
        });
    }
}

/**
 * Dark Mode Toggle
 * FIX: estado inicial explícito para evitar que ambos logos aparezcan
 */
function inicializarDarkMode() {
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const body = document.body;

    let darkModeGuardado = false;
    try {
        darkModeGuardado = localStorage.getItem('darkMode') === 'true';
    } catch(e) {
        darkModeGuardado = false;
    }

    if (darkModeGuardado) {
        body.classList.add('dark-mode');
        if (darkModeToggle) darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        body.classList.remove('dark-mode');
        if (darkModeToggle) darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const esActivo = body.classList.contains('dark-mode');
            try { localStorage.setItem('darkMode', esActivo); } catch(e) {}
            darkModeToggle.innerHTML = esActivo
                ? '<i class="fas fa-sun"></i>'
                : '<i class="fas fa-moon"></i>';
        });
    }
}

/**
 * Validar compatibilidad del navegador
 */
function validarCompatibilidad() {
    if (!window.IntersectionObserver) {
        console.warn('IntersectionObserver no soportado');
    }
}

/**
 * Inicializar todo
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🦷 Studio Dental Center - Iniciando...');

    agregarAnimacionesCSS();
    crearObservadorElementos();
    activarNavegacionActiva();
    controlarBotonFlotante();
    inicializarDarkMode();
    inicializarLoadingScreen();
    inicializarBackToTop();
    inicializarLazyLoading();
    validarCompatibilidad();

    console.log('✅ Sitio cargado correctamente');
});