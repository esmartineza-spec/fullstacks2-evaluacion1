// =============================================================================
// ARCHIVO: productos.js
// PROYECTO: Pastelería Mil Sabores - Evaluación 1 (DSY1104)
// PROPÓSITO: Catálogo de productos, filtros, vista de detalle dinámico y comentarios
// =============================================================================

// -----------------------------------------------------------------------------
// 1. ARREGLO DE PRODUCTOS (16 Delicias Oficiales)
// -----------------------------------------------------------------------------
const LISTA_PRODUCTOS = [
  {
    codigo: 'TC001',
    categoria: 'Tortas Cuadradas',
    nombre: 'Torta Cuadrada de Chocolate',
    precio: 45000,
    descripcion: 'Deliciosa torta de chocolate con capas de ganache y un toque de avellanas. Personalizable con mensajes especiales.',
    imagen: 'img/producto_TC001.avif'
  },
  {
    codigo: 'TC002',
    categoria: 'Tortas Cuadradas',
    nombre: 'Torta Cuadrada de Frutas',
    precio: 50000,
    descripcion: 'Una mezcla de frutas frescas de la estación y crema chantilly sobre un suave bizcocho de vainilla, ideal para celebraciones familiares.',
    imagen: 'img/producto_TC002.avif'
  },
  {
    codigo: 'TT001',
    categoria: 'Tortas Circulares',
    nombre: 'Torta Circular de Vainilla',
    precio: 40000,
    descripcion: 'Bizcocho de vainilla clásico relleno con crema pastelera y cubierto con un glaseado dulce tradicional, perfecto para cualquier ocasión.',
    imagen: 'img/producto_TT001.avif'
  },
  {
    codigo: 'TT002',
    categoria: 'Tortas Circulares',
    nombre: 'Torta Circular de Manjar',
    precio: 42000,
    descripcion: 'Torta tradicional chilena con manjar artesanal y nueces seleccionadas, un deleite para los amantes de los sabores clásicos.',
    imagen: 'img/producto_TT002.avif'
  },
  {
    codigo: 'PI001',
    categoria: 'Postres Individuales',
    nombre: 'Mousse de Chocolate',
    precio: 5000,
    descripcion: 'Postre individual cremoso y suave, hecho con chocolate de alta calidad, ideal para los amantes del chocolate.',
    imagen: 'img/producto_PI001.jpg'
  },
  {
    codigo: 'PI002',
    categoria: 'Postres Individuales',
    nombre: 'Tiramisú Clásico',
    precio: 5500,
    descripcion: 'Un postre italiano individual con capas de café, queso mascarpone y cacao en polvo fino, perfecto para finalizar cualquier comida.',
    imagen: 'img/producto_PI002.avif'
  },
  {
    codigo: 'PSA001',
    categoria: 'Productos Sin Azúcar',
    nombre: 'Torta Sin Azúcar de Naranja',
    precio: 48000,
    descripcion: 'Torta ligera y deliciosa, endulzada naturalmente con cítricos frescos, ideal para quienes buscan opciones más saludables.',
    imagen: 'img/producto_PSA001.avif'
  },
  {
    codigo: 'PSA002',
    categoria: 'Productos Sin Azúcar',
    nombre: 'Cheesecake Sin Azúcar',
    precio: 47000,
    descripcion: 'Suave y cremoso sobre base de frutos secos tostados, este cheesecake es una opción perfecta para disfrutar sin culpa.',
    imagen: 'img/producto_PSA002.avif'
  },
  {
    codigo: 'PT001',
    categoria: 'Pastelería Tradicional',
    nombre: 'Empanada de Manzana',
    precio: 3000,
    descripcion: 'Pastel tradicional chileno relleno de manzanas especiadas con canela, horneado hasta dorar para lograr una masa suave y hojaldrada.',
    imagen: 'img/producto_PT001.avif'
  },
  {
    codigo: 'PT002',
    categoria: 'Pastelería Tradicional',
    nombre: 'Tarta de Santiago',
    precio: 6000,
    descripcion: 'Tarta tradicional a base de almendras seleccionadas, azúcar y huevos, con la emblemática cruz de Santiago marcada con azúcar flor.',
    imagen: 'img/producto_PT002.avif'
  },
  {
    codigo: 'PSG001',
    categoria: 'Productos Sin Gluten',
    nombre: 'Brownie Sin Gluten',
    precio: 4000,
    descripcion: 'Intenso y húmedo brownie de chocolate puro elaborado con harina certificada sin gluten, ideal para personas celíacas.',
    imagen: 'img/producto_PSG001.avif'
  },
  {
    codigo: 'PSG002',
    categoria: 'Productos Sin Gluten',
    nombre: 'Panqueque de Naranja Sin Gluten',
    precio: 45000,
    descripcion: 'Capas finas de panqueque sin gluten rellenas de una suave y aromática crema de naranja natural, decorado artesanalmente.',
    imagen: 'img/producto_PSG002.avif'
  },
  {
    codigo: 'PV001',
    categoria: 'Productos Veganos',
    nombre: 'Torta Vegana de Chocolate',
    precio: 50000,
    descripcion: 'Exquisita torta 100% libre de ingredientes de origen animal, elaborada con cacao orgánico y leche vegetal de primera calidad.',
    imagen: 'img/producto_PV001.avif'
  },
  {
    codigo: 'PV002',
    categoria: 'Productos Veganos',
    nombre: 'Galletas Veganas de Avena',
    precio: 4500,
    descripcion: 'Crujientes y nutritivas galletas a base de avena integral, endulzadas con miel de agave y enriquecidas con pasas y semillas.',
    imagen: 'img/producto_PV002.avif'
  },
  {
    codigo: 'TE001',
    categoria: 'Tortas Especiales',
    nombre: 'Torta Especial de Cumpleaños',
    precio: 55000,
    descripcion: 'Diseñada especialmente para celebraciones únicas. Doble relleno de manjar y chantilly, decorada a mano con flores de azúcar.',
    imagen: 'img/producto_TE001.avif'
  },
  {
    codigo: 'TE002',
    categoria: 'Tortas Especiales',
    nombre: 'Torta Especial de Boda',
    precio: 60000,
    descripcion: 'Elegante creación de varios pisos con detalles artesanales de glaseado real y flores naturales para hacer inolvidable tu matrimonio.',
    imagen: 'img/producto_TE002.jpg'
  }
];

// -----------------------------------------------------------------------------
// 2. DETALLE DINÁMICO DE PRODUCTO (PRODUCTO.HTML)
// Lee el parámetro de la URL (ej: producto.html?id=TC001) y muestra sus datos
// -----------------------------------------------------------------------------
function cargarDatosProducto() {
  const elementoTitulo = document.getElementById('product-name');
  if (!elementoTitulo) return; // Si no estamos en producto.html, salimos

  const parametros = new URLSearchParams(window.location.search);
  const idProducto = parametros.get('id') || 'TE001';

  // Buscamos el producto en nuestro catálogo
  const producto = LISTA_PRODUCTOS.find(p => p.codigo === idProducto) || LISTA_PRODUCTOS[0];

  // Actualizamos el título de la pestaña y los textos
  document.title = `${producto.nombre} | Pastelería Mil Sabores`;
  elementoTitulo.textContent = producto.nombre;

  const migaCat = document.getElementById('breadcrumb-categoria');
  if (migaCat) migaCat.textContent = producto.categoria;

  const migaProd = document.getElementById('breadcrumb-producto');
  if (migaProd) migaProd.textContent = producto.nombre;

  const tag = document.getElementById('product-tag');
  if (tag) tag.textContent = `${producto.categoria} · Código: ${producto.codigo}`;

  const desc = document.getElementById('product-desc');
  if (desc) desc.textContent = producto.descripcion;

  const precio = document.getElementById('precio-torta');
  if (precio) precio.textContent = `$${producto.precio.toLocaleString('es-CL')} CLP`;

  const imgPrincipal = document.getElementById('img-principal');
  if (imgPrincipal) {
    imgPrincipal.src = producto.imagen;
    imgPrincipal.alt = producto.nombre;
  }

  // Opciones de tamaño adaptadas al precio del producto
  const selectTamano = document.getElementById('select-tamano');
  if (selectTamano) {
    const base = producto.precio;
    const precioChica = Math.round(base * 0.75);
    const precioMediana = base;
    const precioGrande = Math.round(base * 1.3);
    const precioFamiliar = Math.round(base * 1.6);

    selectTamano.innerHTML = `
      <option value="Chica" data-precio="${precioChica}">Chica (6 a 8 porciones) - $${precioChica.toLocaleString('es-CL')} CLP</option>
      <option value="Mediana" data-precio="${precioMediana}" selected>Mediana (12 a 15 porciones) - $${precioMediana.toLocaleString('es-CL')} CLP</option>
      <option value="Grande" data-precio="${precioGrande}">Grande (20 a 25 porciones) - $${precioGrande.toLocaleString('es-CL')} CLP</option>
      <option value="Familiar" data-precio="${precioFamiliar}">Familiar (30 a 35 porciones) - $${precioFamiliar.toLocaleString('es-CL')} CLP</option>
    `;
  }
}

// -----------------------------------------------------------------------------
// 3. CONTROLES DEL DETALLE (Cantidad, tamaño, dedicatoria y botón agregar)
// -----------------------------------------------------------------------------
function inicializarDetalleProducto() {
  const btnRestar = document.getElementById('btn-restar');
  const btnSumar = document.getElementById('btn-sumar');
  const inputCantidad = document.getElementById('input-cantidad');
  const btnComprar = document.getElementById('btn-comprar-detalle');
  const selectTamano = document.getElementById('select-tamano');
  const elementoPrecio = document.getElementById('precio-torta');

  if (!btnComprar || !inputCantidad) return;

  // Cambio de precio dinámico según el tamaño
  if (selectTamano && elementoPrecio) {
    selectTamano.addEventListener('change', () => {
      const opcion = selectTamano.options[selectTamano.selectedIndex];
      const precio = opcion.getAttribute('data-precio') || '55000';
      elementoPrecio.textContent = `$${parseInt(precio, 10).toLocaleString('es-CL')} CLP`;
    });
  }

  // Restar cantidad
  if (btnRestar) {
    btnRestar.addEventListener('click', () => {
      let valor = parseInt(inputCantidad.value, 10) || 1;
      if (valor > 1) inputCantidad.value = valor - 1;
    });
  }

  // Sumar cantidad
  if (btnSumar) {
    btnSumar.addEventListener('click', () => {
      let valor = parseInt(inputCantidad.value, 10) || 1;
      inputCantidad.value = valor + 1;
    });
  }

  // Botón Agregar al Carrito desde el detalle
  btnComprar.addEventListener('click', () => {
    const cantidad = parseInt(inputCantidad.value, 10) || 1;
    const forma = document.getElementById('select-forma') ? document.getElementById('select-forma').value : 'Circular';
    
    const parametros = new URLSearchParams(window.location.search);
    const idProducto = parametros.get('id') || 'TE001';
    const productoActual = LISTA_PRODUCTOS.find(p => p.codigo === idProducto) || LISTA_PRODUCTOS[0];

    let tamano = 'Mediana';
    let precio = productoActual.precio;
    if (selectTamano) {
      const opcion = selectTamano.options[selectTamano.selectedIndex];
      tamano = opcion.value;
      precio = parseInt(opcion.getAttribute('data-precio'), 10) || productoActual.precio;
    }

    const mensaje = document.getElementById('input-dedicatoria') ? document.getElementById('input-dedicatoria').value.trim() : '';

    const productoDetalle = {
      codigo: productoActual.codigo,
      nombre: `${productoActual.nombre} (${forma}, ${tamano})`,
      precio: precio,
      cantidad: cantidad,
      personalizacion: mensaje ? `Mensaje: "${mensaje}"` : 'Sin dedicatoria'
    };

    agregarAlCarrito(productoDetalle);
    alert(`🧁 ¡Se agregaron ${cantidad} unidad(es) de "${productoDetalle.nombre}" a tu carrito!`);
  });
}

// -----------------------------------------------------------------------------
// 4. CAMBIAR FOTO AL HACER CLIC EN MINIATURA
// -----------------------------------------------------------------------------
function cambiarFoto(nuevaSrc, elementoMiniatura) {
  const imagenGrande = document.getElementById('img-principal');
  if (imagenGrande) {
    imagenGrande.src = nuevaSrc;
  }

  if (elementoMiniatura) {
    const todasLasMiniaturas = document.querySelectorAll('.thumbnail-item');
    todasLasMiniaturas.forEach(miniatura => miniatura.classList.remove('active'));
    elementoMiniatura.classList.add('active');
  }
}

// -----------------------------------------------------------------------------
// 5. FILTROS Y BUSCADOR DEL CATÁLOGO (CATEGORIA.HTML)
// -----------------------------------------------------------------------------
function inicializarFiltrosCatalogo() {
  const botonesFiltro = document.querySelectorAll('.filter-btn');
  const itemsCatalogo = document.querySelectorAll('.catalog-item');
  const buscador = document.getElementById('buscador-productos');
  const textoContador = document.getElementById('total-mostrados');
  const selectForma = document.getElementById('filtro-forma');

  if (itemsCatalogo.length === 0) return;

  function aplicarFiltros() {
    const botonActivo = document.querySelector('.filter-btn.active');
    const categoria = botonActivo ? botonActivo.getAttribute('data-categoria') : 'todos';
    const forma = selectForma ? selectForma.value.toLowerCase() : 'todas';
    const texto = buscador ? buscador.value.toLowerCase().trim() : '';

    let visibles = 0;
    itemsCatalogo.forEach(item => {
      const catItem = item.getAttribute('data-categoria') || '';
      const titulo = item.querySelector('.catalog-item-title').textContent.toLowerCase();
      const desc = item.querySelector('.catalog-item-desc').textContent.toLowerCase();
      const codigo = (item.getAttribute('data-codigo') || '').toLowerCase();

      // Validación por categoría
      const coincideCat = (categoria === 'todos' || catItem === categoria);

      // Validación por forma (cuadrada o circular)
      let coincideForma = true;
      if (forma === 'cuadrada') {
        coincideForma = titulo.includes('cuadrada') || catItem === 'cuadradas';
      } else if (forma === 'circular') {
        coincideForma = titulo.includes('circular') || catItem === 'circulares';
      }

      // Validación por texto escrito
      const coincideTexto = !texto || titulo.includes(texto) || desc.includes(texto) || codigo.includes(texto);

      if (coincideCat && coincideForma && coincideTexto) {
        item.style.display = 'flex';
        visibles++;
      } else {
        item.style.display = 'none';
      }
    });

    if (textoContador) {
      textoContador.textContent = `${visibles} producto(s) en catálogo`;
    }
  }

  botonesFiltro.forEach(boton => {
    boton.addEventListener('click', () => {
      botonesFiltro.forEach(b => b.classList.remove('active'));
      boton.classList.add('active');
      aplicarFiltros();
    });
  });

  if (selectForma) selectForma.addEventListener('change', aplicarFiltros);
  if (buscador) buscador.addEventListener('input', aplicarFiltros);

  // Si viene con parámetro ?cat=... desde otra página
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('cat');
  if (catParam) {
    const botonCoincidente = document.querySelector(`.filter-btn[data-categoria="${catParam}"]`);
    if (botonCoincidente) botonCoincidente.click();
  } else {
    aplicarFiltros();
  }
}

// -----------------------------------------------------------------------------
// 6. COMENTARIOS DE CLIENTES (PRODUCTO.HTML)
// -----------------------------------------------------------------------------
function inicializarComentariosProducto() {
  const lista = document.getElementById('lista-comentarios-producto');
  const form = document.getElementById('form-comentario-producto');
  if (!lista || !form) return;

  const comentariosBase = [
    { autor: 'Camila Rojas', estrellas: '⭐⭐⭐⭐⭐', texto: '¡La mejor torta de cumpleaños! El bizcocho muy húmedo y el manjar artesanal delicioso.' },
    { autor: 'Felipe Mendoza', estrellas: '⭐⭐⭐⭐⭐', texto: 'Llegó puntual y la dedicatoria venía tal como la pedí. 100% recomendada.' }
  ];

  function renderComentarios() {
    lista.innerHTML = '';
    comentariosBase.forEach(com => {
      const item = document.createElement('div');
      item.style.cssText = 'padding: 1rem; border-radius: 10px; background: var(--bg-card-soft); border: 1px solid var(--border-subtle);';
      item.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.3rem;">
          <strong>👤 ${com.autor}</strong>
          <span>${com.estrellas}</span>
        </div>
        <p style="margin: 0; font-size: 0.92rem; color: var(--text-secondary);">${com.texto}</p>
      `;
      lista.appendChild(item);
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('com-nombre').value.trim();
    const estrellas = document.getElementById('com-estrellas').value;
    const texto = document.getElementById('com-texto').value.trim();

    comentariosBase.unshift({ autor: nombre, estrellas: estrellas, texto: texto });
    renderComentarios();
    alert('✓ ¡Gracias por tu comentario! Ha sido publicado.');
    form.reset();
  });

  renderComentarios();
}
