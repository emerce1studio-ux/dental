// ============================================
// FUNCIONALIDAD DE WHATSAPP
// ============================================

// Número de teléfono de la clínica (con código de país)
const NUMERO_WHATSAPP = '50685855758';

// Mensajes predeterminados según el botón clickeado
const mensajes = {
    agendar: 'Hola Studio Dental Center, quiero agendar una cita',
    general: 'Hola Studio Dental Center, tengo una consulta'
};

/**
 * Función para generar el URL de WhatsApp
 * @param {string} numero - Número de teléfono sin formato
 * @param {string} mensaje - Mensaje a enviar
 * @returns {string} URL para abrir WhatsApp
 */
function generarURLWhatsApp(numero, mensaje) {
    const mensajeCodificado = encodeURIComponent(mensaje);
    return `https://wa.me/${numero}?text=${mensajeCodificado}`;
}

/**
 * Función para enviar mensaje a través de WhatsApp
 * @param {string} tipo - Tipo de mensaje (agendar, general, etc)
 */
function enviarWhatsApp(tipo = 'agendar') {
    const mensaje = mensajes[tipo] || mensajes.general;
    const url = generarURLWhatsApp(NUMERO_WHATSAPP, mensaje);
    window.open(url, '_blank');
}

// Event listeners para botones de WhatsApp
document.addEventListener('DOMContentLoaded', function() {
    // Botón del navbar
    const btnNavbar = document.querySelector('.navbar-whatsapp');
    if (btnNavbar) {
        btnNavbar.addEventListener('click', function(e) {
            e.preventDefault();
            enviarWhatsApp('agendar');
        });
    }

    // Botón flotante
    const btnFlotante = document.querySelector('.whatsapp-flotante');
    if (btnFlotante) {
        btnFlotante.addEventListener('click', function(e) {
            e.preventDefault();
            enviarWhatsApp('agendar');
        });
    }

    // Botón CTA en hero section
    const btnHero = document.querySelector('.hero .btn-primary');
    if (btnHero) {
        btnHero.addEventListener('click', function(e) {
            e.preventDefault();
            enviarWhatsApp('agendar');
        });
    }

    // Todos los links de WhatsApp
    const enlacesWhatsApp = document.querySelectorAll('a[href*="wa.me"]');
    enlacesWhatsApp.forEach(enlace => {
        enlace.addEventListener('click', function(e) {
            e.preventDefault();
            enviarWhatsApp('agendar');
        });
    });
});