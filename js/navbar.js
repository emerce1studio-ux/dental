// ============================================
// FUNCIONALIDAD DEL NAVBAR - MENÚ HAMBURGUESA
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navbarMenu = document.querySelector('.navbar-menu');
    const navbarLinks = document.querySelectorAll('.navbar-menu a');
    const navbar = document.querySelector('.navbar');

    // ============================================
    // ABRIR/CERRAR MENÚ HAMBURGUESA
    // ============================================
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        hamburger.classList.toggle('activo');
        navbarMenu.classList.toggle('activo');
        
        // Prevenir scroll cuando menú está abierto
        if (navbarMenu.classList.contains('activo')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    });

    // ============================================
    // CERRAR MENÚ AL HACER CLICK EN UN LINK
    // ============================================
    navbarLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('activo');
            navbarMenu.classList.remove('activo');
            document.body.style.overflow = 'auto';
        });
    });

    // ============================================
    // CERRAR MENÚ AL HACER CLICK FUERA
    // ============================================
    document.addEventListener('click', function(event) {
        const isClickInsideNavbar = navbar.contains(event.target);
        
        if (!isClickInsideNavbar && navbarMenu.classList.contains('activo')) {
            hamburger.classList.remove('activo');
            navbarMenu.classList.remove('activo');
            document.body.style.overflow = 'auto';
        }
    });

    // ============================================
    // CERRAR MENÚ AL HACER SCROLL
    // ============================================
    window.addEventListener('scroll', function() {
        if (navbarMenu.classList.contains('activo')) {
            hamburger.classList.remove('activo');
            navbarMenu.classList.remove('activo');
            document.body.style.overflow = 'auto';
        }
    });

    // ============================================
    // EFECTO SHADOW AL HACER SCROLL
    // ============================================
    window.addEventListener('scroll', function() {
        if (window.scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    console.log('✅ Navbar cargado');
});