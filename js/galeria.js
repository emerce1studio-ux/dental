// ============================================
// FUNCIONALIDAD DE LA GALERÍA
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🖼️ Galería cargada');

    // ============================================
    // FILTRADO POR CATEGORÍAS
    // ============================================

    const tabBtns = document.querySelectorAll('.tab-btn');
    const galeriaItems = document.querySelectorAll('.galeria-item');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            // Remover clase activo de todos los botones
            tabBtns.forEach(b => b.classList.remove('activo'));
            
            // Agregar clase activo al botón clickeado
            btn.classList.add('activo');

            // Filtrar items
            galeriaItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'todo' || category === filter) {
                    item.classList.remove('oculto');
                    item.style.animation = 'fadeInUp 0.6s ease-out backwards';
                } else {
                    item.classList.add('oculto');
                }
            });
        });
    });

    // ============================================
    // MODAL ZOOM DE IMÁGENES
    // ============================================

    const galeriaModal = document.getElementById('galeriaModal');
    const galeriaModalImg = document.getElementById('galeriaModalImg');
    const galeriaModalClose = document.querySelector('.galeria-modal-close');
    const zoomBtns = document.querySelectorAll('.galeria-btn-zoom');

    // Abrir modal
    zoomBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const imageSrc = btn.getAttribute('data-image');
            galeriaModalImg.src = imageSrc;
            galeriaModal.classList.add('activo');
            document.body.style.overflow = 'hidden';
        });
    });

    // Cerrar modal
    function cerrarModal() {
        galeriaModal.classList.remove('activo');
        document.body.style.overflow = 'auto';
    }

    galeriaModalClose.addEventListener('click', cerrarModal);

    // Cerrar modal al hacer click fuera de la imagen
    galeriaModal.addEventListener('click', (e) => {
        if (e.target === galeriaModal) {
            cerrarModal();
        }
    });

    // Cerrar modal con tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && galeriaModal.classList.contains('activo')) {
            cerrarModal();
        }
    });

    console.log('✅ Galería funcionando correctamente');
});