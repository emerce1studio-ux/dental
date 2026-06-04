// ============================================
// FUNCIONES GENERALES Y UTILIDADES
// ============================================

/**
 * Animación suave de scroll
 * Se ejecuta automáticamente cuando haces click en links con #
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Evitar si es solo "#"
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
 * Efecto de aparición al hacer scroll (Fade-in)
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

    // Observar todas las tarjetas de servicios
    document.querySelectorAll('.servicio-card').forEach(card => {
        observador.observe(card);
    });

    // Observar items de contacto
    document.querySelectorAll('.info-item').forEach(item => {
        observador.observe(item);
    });
}

/**
 * Agregar animación CSS
 */
function agregarAnimacionesCSS() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .servicio-card {
            animation: fadeIn 0.6s ease-out backwards;
        }

        .info-item {
            animation: fadeIn 0.6s ease-out backwards;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Función para animar números (contador)
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
 * Crear contadores animados en la sección "¿Por qué elegirnos?"
 */
function crearContadores() {
    const tarjetas = document.querySelectorAll('.porqueelejiros-card');
    let contadoresAnimados = false;

    const opciones = {
        threshold: 0.5
    };

    const observador = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !contadoresAnimados) {
                // Animar primer número (5 años)
                if (tarjetas[1]) {
                    const h3 = tarjetas[1].querySelector('h3');
                    if (h3 && h3.textContent.includes('2019')) {
                        h3.innerHTML = '<span class="contador">0</span>+ años';
                        animarNumero(h3.querySelector('.contador'), 5, 1500);
                    }
                }
                
                contadoresAnimados = true;
                observador.unobserve(tarjetas[1]);
            }
        });
    }, opciones);

    if (tarjetas[1]) {
        observador.observe(tarjetas[1]);
    }
}

/**
 * Función para cambiar el color activo del navbar al hacer scroll
 */
function activarNavegacionActiva() {
    const secciones = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar-menu a');

    window.addEventListener('scroll', () => {
        let actual = '';

        secciones.forEach(seccion => {
            const altoSeccion = seccion.offsetTop;
            const altoTotal = seccion.clientHeight;

            if (scrollY >= altoSeccion - 100) {
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
 * Añadir estilos para link activo
 */
function agregarEstilosActivos() {
    const style = document.createElement('style');
    style.textContent = `
        .navbar-menu a.activo {
            color: var(--color-primario);
            border-bottom: 3px solid var(--color-primario);
            padding-bottom: 5px;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Mostrar/ocultar botón WhatsApp flotante al hacer scroll
 */
function controlarBotonFlotante() {
    const btnFlotante = document.querySelector('.whatsapp-flotante');
    
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
    
    // Ocultar loading después de 2 segundos
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
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Lazy Loading de Imágenes - Versión Simple
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
        }, {
            rootMargin: '100px'
        });
        
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            img.style.opacity = '1';
            imageObserver.observe(img);
        });
    }
}

/**
 * Dark Mode Toggle
 */
function inicializarDarkMode() {
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const body = document.body;

    // Verificar preferencia guardada
    const darkModeActivo = localStorage.getItem('darkMode') === 'true';
    if (darkModeActivo) {
        body.classList.add('dark-mode');
        if (darkModeToggle) {
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const esActivo = body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', esActivo);
            
            // Cambiar icono
            if (esActivo) {
                darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            }
        });
    }
}

/**
 * Función para validar si el navegador soporta características modernas
 */
function validarCompatibilidad() {
    if (!window.IntersectionObserver) {
        console.warn('IntersectionObserver no soportado');
    }
}

/**
 * Inicializar todas las funciones
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🦷 Studio Dental Center - Iniciando...');

    // Agregar animaciones CSS
    agregarAnimacionesCSS();
    agregarEstilosActivos();

    // Crear observador de elementos
    crearObservadorElementos();

    // Activar navegación activa
    activarNavegacionActiva();

    // Controlar botón flotante
    controlarBotonFlotante();

    // Inicializar Dark Mode
    inicializarDarkMode();

    // Crear contadores animados
    crearContadores();

    // Inicializar Loading Screen
    inicializarLoadingScreen();

    // Inicializar Back to Top
    inicializarBackToTop();

    // Inicializar Lazy Loading
    inicializarLazyLoading();

    // Validar compatibilidad
    validarCompatibilidad();

    console.log('✅ Sitio cargado correctamente');
});