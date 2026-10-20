// =============================================================================
// ARCHIVO: main.js
// PROYECTO: Pastelería Mil Sabores - Evaluación 1 (DSY1104)
// PROPÓSITO: Coordinador principal, menú responsive, contacto y recetas del blog
// =============================================================================

// Esperamos a que el DOM esté completamente cargado para inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
  console.log('Pastelería Mil Sabores - Sistema modular iniciado correctamente.');

  // 1. Menú responsive y estado general del navbar
  iniciarMenuMovil();
  if (typeof actualizarContadorCarrito === 'function') actualizarContadorCarrito();
  if (typeof actualizarBarraUsuario === 'function') actualizarBarraUsuario();

  // 2. Módulo de Productos (productos.js)
  if (typeof activarBotonesAgregar === 'function') activarBotonesAgregar();
  if (typeof cargarDatosProducto === 'function') cargarDatosProducto();
  if (typeof inicializarDetalleProducto === 'function') inicializarDetalleProducto();
  if (typeof inicializarFiltrosCatalogo === 'function') inicializarFiltrosCatalogo();
  if (typeof inicializarComentariosProducto === 'function') inicializarComentariosProducto();

  // 3. Módulo de Usuarios (usuarios.js)
  if (typeof inicializarRegistro === 'function') inicializarRegistro();
  if (typeof inicializarLogin === 'function') inicializarLogin();
  if (typeof inicializarPerfil === 'function') inicializarPerfil();
  if (typeof inicializarSugerenciasPerfil === 'function') inicializarSugerenciasPerfil();

  // 4. Módulo de Carrito, Boleta y Seguimiento (carrito.js)
  if (typeof inicializarCarrito === 'function') inicializarCarrito();
  if (typeof inicializarBoleta === 'function') inicializarBoleta();
  if (typeof inicializarSeguimiento === 'function') inicializarSeguimiento();

  // 5. Formularios generales (Contacto y Blog)
  inicializarFormularioContacto();
  inicializarRecetasBlog();
});

// -----------------------------------------------------------------------------
// 1. MENÚ RESPONSIVE (Para celulares y tablets)
// -----------------------------------------------------------------------------
function iniciarMenuMovil() {
  const botonMenu = document.querySelector('.menu-toggle');
  const menuNav = document.querySelector('nav');

  if (botonMenu && menuNav) {
    botonMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      menuNav.classList.toggle('nav-open');
    });

    // Cerrar el menú al hacer clic en cualquier enlace
    const enlaces = menuNav.querySelectorAll('a');
    enlaces.forEach(enlace => {
      enlace.addEventListener('click', () => {
        menuNav.classList.remove('nav-open');
      });
    });

    // Cerrar el menú al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (!menuNav.contains(e.target) && !botonMenu.contains(e.target)) {
        menuNav.classList.remove('nav-open');
      }
    });
  }
}

// -----------------------------------------------------------------------------
// 2. FORMULARIO DE CONTACTO (CONTACTO.HTML)
// -----------------------------------------------------------------------------
function inicializarFormularioContacto() {
  const formulario = document.getElementById('form-contacto');
  if (!formulario) return;

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const nombre = document.getElementById('contacto-nombre').value.trim();
    const email = document.getElementById('contacto-email').value.trim();

    if (!nombre || !email) {
      alert('Por favor completa los campos obligatorios (*)');
      return;
    }

    alert(`🧁 ¡Muchas gracias ${nombre}! Tu consulta ha sido enviada con éxito. Te responderemos pronto a ${email}.`);
    formulario.reset();
  });
}

// -----------------------------------------------------------------------------
// 3. RECETAS Y CONSEJOS EN EL BLOG (BLOGS.HTML)
// -----------------------------------------------------------------------------
function inicializarRecetasBlog() {
  const lista = document.getElementById('lista-recetas-comunidad');
  const form = document.getElementById('form-receta-blog');
  if (!lista || !form) return;

  const recetasBase = [
    { 
      autor: 'Sofía Navarro (Gastronomía Duoc UC)', 
      titulo: 'Merengue suizo brillante y firme', 
      puntuacion: '⭐⭐ Media', 
      contenido: 'Calentar las claras con el azúcar a baño maría hasta disolver los cristales antes de batir a velocidad máxima.' 
    }
  ];

  function renderRecetas() {
    lista.innerHTML = '';
    recetasBase.forEach(rec => {
      const item = document.createElement('div');
      item.style.cssText = 'padding: 1.2rem; border-radius: 10px; background: var(--bg-card-soft); border: 1px solid var(--border-subtle);';
      item.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem; flex-wrap: wrap; gap: 0.5rem;">
          <h4 style="margin: 0; font-family: var(--font-serif); font-size: 1.1rem; color: var(--color-chocolate);">${rec.titulo}</h4>
          <span class="badge badge-gold" style="font-size: 0.72rem;">${rec.puntuacion}</span>
        </div>
        <p style="margin: 0.4rem 0; font-size: 0.92rem; color: var(--text-secondary); line-height: 1.5;">${rec.contenido}</p>
        <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted);">Aporte de: ${rec.autor}</span>
      `;
      lista.appendChild(item);
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const autor = document.getElementById('rec-autor').value.trim();
    const titulo = document.getElementById('rec-titulo').value.trim();
    const puntuacion = document.getElementById('rec-puntuacion').value;
    const contenido = document.getElementById('rec-contenido').value.trim();

    recetasBase.unshift({ autor: autor, titulo: titulo, puntuacion: puntuacion, contenido: contenido });
    renderRecetas();
    alert(`🎉 ¡Gracias ${autor}! Tu publicación fue añadida al blog.`);
    form.reset();
  });

  renderRecetas();
}
