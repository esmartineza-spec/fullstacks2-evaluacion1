// =============================================================================
// ARCHIVO: carrito.js
// PROYECTO: Pastelería Mil Sabores - Evaluación 1 (DSY1104)
// PROPÓSITO: Carrito de compras, descuentos (+50 años y cupones), boleta y seguimiento
// =============================================================================

// -----------------------------------------------------------------------------
// 1. FUNCIONES BASE DEL CARRITO (LOCALSTORAGE)
// -----------------------------------------------------------------------------
function obtenerCarrito() {
  const datosGuardados = localStorage.getItem('carrito_mil_sabores');
  return datosGuardados ? JSON.parse(datosGuardados) : [];
}

function guardarCarrito(listaProductos) {
  localStorage.setItem('carrito_mil_sabores', JSON.stringify(listaProductos));
  actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
  const contadorElemento = document.getElementById('num-cont-carrito');
  if (!contadorElemento) return;

  const carrito = obtenerCarrito();
  let totalProductos = 0;
  for (let i = 0; i < carrito.length; i++) {
    totalProductos += carrito[i].cantidad;
  }
  contadorElemento.textContent = totalProductos;
}

function agregarAlCarrito(producto) {
  const carrito = obtenerCarrito();

  let productoExistente = null;
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].codigo === producto.codigo && carrito[i].personalizacion === producto.personalizacion) {
      productoExistente = carrito[i];
      break;
    }
  }

  if (productoExistente) {
    productoExistente.cantidad += producto.cantidad || 1;
  } else {
    carrito.push(producto);
  }

  guardarCarrito(carrito);
}

function activarBotonesAgregar() {
  const botones = document.querySelectorAll('.btn-add-cart');

  botones.forEach(boton => {
    boton.addEventListener('click', (evento) => {
      const tarjeta = evento.target.closest('.product-card');
      if (!tarjeta) return;

      const codigo = tarjeta.getAttribute('data-codigo');
      const nombre = tarjeta.getAttribute('data-nombre');
      const precio = parseInt(tarjeta.getAttribute('data-precio'), 10);

      const nuevoProducto = {
        codigo: codigo,
        nombre: nombre,
        precio: precio,
        cantidad: 1,
        personalizacion: 'Estándar'
      };

      agregarAlCarrito(nuevoProducto);
      alert(`🧁 ¡"${nombre}" fue agregado a tu carrito!`);
    });
  });
}

// -----------------------------------------------------------------------------
// 2. VISTA DEL CARRITO DE COMPRAS (CARRITO.HTML)
// -----------------------------------------------------------------------------
function inicializarCarrito() {
  const contenedor = document.getElementById('lista-items-carrito');
  if (!contenedor) return;

  let porcentajeDescuento = 0;
  let motivoDescuento = '';
  const usuario = (typeof obtenerUsuarioActual === 'function') ? obtenerUsuarioActual() : null;

  // Detección automática de beneficios del usuario activo
  if (usuario) {
    if (usuario.descuentoSenior) {
      porcentajeDescuento = 50;
      motivoDescuento = 'Descuento Senior Mayores de 50 Años (50%)';
    } else if (usuario.descuentoFelices50) {
      porcentajeDescuento = 10;
      motivoDescuento = 'Descuento de por Vida FELICES50 (10%)';
    }
  }

  function renderizarCarrito() {
    const carrito = obtenerCarrito();
    const divVacio = document.getElementById('carrito-vacio');

    contenedor.innerHTML = '';

    if (carrito.length === 0) {
      if (divVacio) divVacio.style.display = 'block';
      actualizarResumen(0);
      return;
    }

    if (divVacio) divVacio.style.display = 'none';

    let subtotal = 0;

    carrito.forEach((item, i) => {
      const precioTotalItem = item.precio * item.cantidad;
      subtotal += precioTotalItem;

      // Buscar foto del producto en el catálogo
      const prodEncontrado = (typeof LISTA_PRODUCTOS !== 'undefined') ? LISTA_PRODUCTOS.find(p => p.codigo === item.codigo) : null;
      const imgPath = prodEncontrado ? prodEncontrado.imagen : 'img/producto_TE001.avif';

      const fila = document.createElement('div');
      fila.className = 'cart-item';
      fila.innerHTML = `
        <div class="cart-item-img-wrap" style="width: 75px; height: 75px; border-radius: 10px; overflow: hidden; border: 1px solid var(--border-subtle); flex-shrink: 0;">
          <img src="${imgPath}" alt="${item.nombre}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div class="cart-item-info" style="flex: 1;">
          <p class="cart-item-name" style="font-weight: 700; color: var(--text-main);">${item.nombre}</p>
          <p class="cart-item-personalizacion" style="font-size: 0.85rem; color: var(--text-secondary);">${item.personalizacion || 'Estándar'}</p>
          <span class="cart-item-unit-price" style="font-size: 0.82rem; color: var(--text-muted);">$${item.precio.toLocaleString('es-CL')} c/u</span>
        </div>
        <div class="cart-item-qty-control" style="display: flex; align-items: center; gap: 0.4rem; background: var(--bg-card-soft); padding: 0.2rem 0.6rem; border-radius: 20px; border: 1px solid var(--border-subtle);">
          <button type="button" class="btn-qty-action btn-minus" data-indice="${i}" style="border: none; background: none; font-weight: 900; font-size: 1.1rem; cursor: pointer; color: var(--color-chocolate); width: 22px;">-</button>
          <span style="font-weight: 700; font-size: 0.95rem; min-width: 18px; text-align: center;">${item.cantidad}</span>
          <button type="button" class="btn-qty-action btn-plus" data-indice="${i}" style="border: none; background: none; font-weight: 900; font-size: 1.1rem; cursor: pointer; color: var(--color-chocolate); width: 22px;">+</button>
        </div>
        <div style="text-align: right; min-width: 105px;">
          <span class="cart-item-precio" style="font-weight: 700; font-size: 1.05rem; color: var(--text-main); display: block;">$${precioTotalItem.toLocaleString('es-CL')} CLP</span>
          <button class="cart-item-eliminar" data-indice="${i}" aria-label="Eliminar producto" style="background: none; border: none; color: #d32f2f; font-size: 0.82rem; cursor: pointer; text-decoration: underline; margin-top: 4px;">Eliminar</button>
        </div>
      `;

      contenedor.appendChild(fila);
    });

    // Eventos: restar cantidad
    contenedor.querySelectorAll('.btn-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const indice = parseInt(btn.getAttribute('data-indice'), 10);
        const carritoActual = obtenerCarrito();
        if (carritoActual[indice].cantidad > 1) {
          carritoActual[indice].cantidad--;
        } else {
          carritoActual.splice(indice, 1);
        }
        guardarCarrito(carritoActual);
        renderizarCarrito();
      });
    });

    // Eventos: sumar cantidad
    contenedor.querySelectorAll('.btn-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const indice = parseInt(btn.getAttribute('data-indice'), 10);
        const carritoActual = obtenerCarrito();
        carritoActual[indice].cantidad++;
        guardarCarrito(carritoActual);
        renderizarCarrito();
      });
    });

    // Eventos: eliminar producto
    contenedor.querySelectorAll('.cart-item-eliminar').forEach(btn => {
      btn.addEventListener('click', () => {
        const indice = parseInt(btn.getAttribute('data-indice'), 10);
        const carritoActual = obtenerCarrito();
        carritoActual.splice(indice, 1);
        guardarCarrito(carritoActual);
        renderizarCarrito();
      });
    });

    actualizarResumen(subtotal);
  }

  function actualizarResumen(subtotal) {
    const ENVIO = 3500;
    const montoDescuento = Math.round(subtotal * (porcentajeDescuento / 100));
    const total = Math.max(0, subtotal - montoDescuento) + (subtotal > 0 ? ENVIO : 0);

    const elemSubtotal = document.getElementById('resumen-subtotal');
    if (elemSubtotal) elemSubtotal.textContent = `$${subtotal.toLocaleString('es-CL')} CLP`;

    const elemTotal = document.getElementById('resumen-total');
    if (elemTotal) elemTotal.textContent = `$${total.toLocaleString('es-CL')} CLP`;

    const filaDescuento = document.getElementById('fila-descuento');
    const elemDescuento = document.getElementById('resumen-descuento');
    const labelDesc = document.getElementById('label-descuento');

    if (porcentajeDescuento > 0 && filaDescuento && elemDescuento) {
      filaDescuento.style.display = 'flex';
      elemDescuento.textContent = `-$${montoDescuento.toLocaleString('es-CL')} CLP`;
      if (labelDesc && motivoDescuento) labelDesc.textContent = motivoDescuento;
    } else if (filaDescuento) {
      filaDescuento.style.display = 'none';
    }

    // Aviso de beneficio activo
    const avisoBeneficio = document.getElementById('aviso-beneficio-usuario');
    if (avisoBeneficio && usuario) {
      if (usuario.descuentoSenior) {
        avisoBeneficio.style.display = 'block';
        avisoBeneficio.innerHTML = `🎉 <strong>¡Beneficio Senior Aplicado!</strong> Tienes un 50% de descuento en todos tus productos por tener ${usuario.edad || '50+'} años.`;
      } else if (usuario.esEstudianteDuoc) {
        avisoBeneficio.style.display = 'block';
        avisoBeneficio.innerHTML = `🎓 <strong>¡Comunidad Duoc UC!</strong> Registrado con correo institucional. Tu regalo de cumpleaños está asegurado.`;
      }
    }
  }

  // Aplicación manual de cupones
  const btnAplicar = document.getElementById('btn-aplicar-codigo');
  if (btnAplicar) {
    btnAplicar.addEventListener('click', () => {
      const inputCodigo = document.getElementById('input-codigo');
      const msgCodigo = document.getElementById('msg-codigo');
      const codigo = inputCodigo ? inputCodigo.value.trim().toUpperCase() : '';

      if (codigo === 'FELICES50') {
        if (10 > porcentajeDescuento) {
          porcentajeDescuento = 10;
          motivoDescuento = 'Descuento FELICES50 (10%)';
        }
        if (msgCodigo) {
          msgCodigo.style.display = 'block';
          msgCodigo.style.color = '#2e7d32';
          if (porcentajeDescuento > 10) {
            msgCodigo.textContent = `✓ Código FELICES50 válido, pero tu descuento actual (${porcentajeDescuento}%) ya es mayor. ¡Se mantiene el mejor beneficio!`;
          } else {
            msgCodigo.textContent = '✓ Código FELICES50 aplicado: 10% de descuento de por vida.';
          }
        }
      } else if (codigo === 'DUOCUMPLE') {
        if (20 > porcentajeDescuento) {
          porcentajeDescuento = 20;
          motivoDescuento = 'Promoción Cumpleaños Estudiante Duoc UC (20%)';
        }
        if (msgCodigo) {
          msgCodigo.style.display = 'block';
          msgCodigo.style.color = '#2e7d32';
          if (porcentajeDescuento > 20) {
            msgCodigo.textContent = `✓ Código válido, pero tu descuento actual (${porcentajeDescuento}%) ya es mayor.`;
          } else {
            msgCodigo.textContent = '✓ Beneficio Estudiante Duoc activado para tu celebración.';
          }
        }
      } else if (!codigo) {
        if (msgCodigo) {
          msgCodigo.style.display = 'block';
          msgCodigo.style.color = '#c62828';
          msgCodigo.textContent = 'Por favor introduce un código.';
        }
      } else {
        if (msgCodigo) {
          msgCodigo.style.display = 'block';
          msgCodigo.style.color = '#c62828';
          msgCodigo.textContent = '✗ Código inválido. Prueba con FELICES50.';
        }
      }

      const carrito = obtenerCarrito();
      let subtotal = 0;
      carrito.forEach(item => subtotal += item.precio * item.cantidad);
      actualizarResumen(subtotal);
    });
  }

  // Confirmar Pedido -> Genera Boleta Electrónica
  const btnConfirmar = document.getElementById('btn-confirmar');
  if (btnConfirmar) {
    btnConfirmar.addEventListener('click', () => {
      const carrito = obtenerCarrito();
      if (carrito.length === 0) {
        alert('Tu carrito está vacío. Agrega productos de nuestro catálogo antes de confirmar.');
        return;
      }

      const inputFecha = document.getElementById('input-fecha-entrega');
      const selectHorario = document.getElementById('select-horario-entrega');
      const inputDireccion = document.getElementById('input-direccion-despacho');

      const fechaEntrega = inputFecha && inputFecha.value ? inputFecha.value : new Date(Date.now() + 86400000).toISOString().split('T')[0];
      const horarioEntrega = selectHorario ? selectHorario.value : '10:00 a 14:00 hrs';
      const direccion = inputDireccion && inputDireccion.value ? inputDireccion.value : (usuario ? (usuario.direccion || 'Av. Concha y Toro #1234') : 'Retiro en Tienda / Domicilio');

      let subtotal = 0;
      carrito.forEach(item => subtotal += item.precio * item.cantidad);
      const ENVIO = 3500;
      const montoDescuento = Math.round(subtotal * (porcentajeDescuento / 100));
      const total = subtotal - montoDescuento + ENVIO;

      const nuevoPedido = {
        folio: 'MS-' + Math.floor(100000 + Math.random() * 900000),
        fecha: new Date().toLocaleDateString('es-CL'),
        hora: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
        items: carrito,
        subtotal: subtotal,
        porcentajeDescuento: porcentajeDescuento,
        montoDescuento: montoDescuento,
        motivoDescuento: motivoDescuento || 'Sin descuento',
        envio: ENVIO,
        iva: Math.round(total * 0.19 / 1.19),
        total: total,
        cliente: usuario ? usuario.nombre : 'Cliente Invitado',
        email: usuario ? usuario.email : 'contacto@pasteleriamilsabores.cl',
        telefono: usuario ? (usuario.telefono || '+56 9 2987 6543') : '+56 9 2987 6543',
        direccion: direccion,
        fechaEntrega: fechaEntrega,
        horarioEntrega: horarioEntrega,
        estado: 'Confirmado',
        repartidor: 'Carlos Valenzuela - Repartos Mil Sabores (Furgón Refrigerado)'
      };

      localStorage.setItem('ultimo_pedido_mil_sabores', JSON.stringify(nuevoPedido));

      // Guardar en historial de compras
      try {
        const historial = JSON.parse(localStorage.getItem('historial_pedidos_mil_sabores') || '[]');
        historial.unshift(nuevoPedido);
        localStorage.setItem('historial_pedidos_mil_sabores', JSON.stringify(historial));
      } catch (e) {}

      // Vaciamos el carrito tras comprar
      guardarCarrito([]);

      alert('🎉 ¡Pedido generado con éxito! Redirigiendo a tu boleta electrónica...');
      window.location.href = 'boleta.html';
    });
  }

  renderizarCarrito();
}

// -----------------------------------------------------------------------------
// 3. BOLETA ELECTRÓNICA (BOLETA.HTML)
// -----------------------------------------------------------------------------
function inicializarBoleta() {
  const contenedorBoleta = document.getElementById('boleta-container');
  if (!contenedorBoleta) return;

  let pedido = null;
  try {
    pedido = JSON.parse(localStorage.getItem('ultimo_pedido_mil_sabores'));
  } catch (e) {}

  if (!pedido) {
    pedido = {
      folio: 'MS-501995',
      fecha: new Date().toLocaleDateString('es-CL'),
      hora: '14:30',
      cliente: 'Rosa María Carrasco',
      email: 'rosa.carrasco@gmail.com',
      telefono: '+56 9 7654 3210',
      direccion: 'Av. Concha y Toro #1234, Santiago, Chile',
      fechaEntrega: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      horarioEntrega: '10:00 - 14:00 hrs',
      subtotal: 55000,
      porcentajeDescuento: 50,
      montoDescuento: 27500,
      motivoDescuento: 'Descuento Senior 50 Años o Más (50%)',
      envio: 3500,
      iva: 4950,
      total: 31000,
      items: [
        {
          codigo: 'TE001',
          nombre: 'Torta Especial de Cumpleaños',
          precio: 55000,
          cantidad: 1,
          personalizacion: 'Forma: Circular · Tamaño: Mediana (12-15 porc.) · Mensaje: "¡Felices 50 Años Familia!"'
        }
      ]
    };
  }

  const setTxt = (id, txt) => {
    const el = document.getElementById(id);
    if (el) el.textContent = txt;
  };

  setTxt('bol-folio', pedido.folio);
  setTxt('bol-fecha', `${pedido.fecha} a las ${pedido.hora} hrs`);
  setTxt('bol-cliente', pedido.cliente);
  setTxt('bol-email', pedido.email);
  setTxt('bol-telefono', pedido.telefono);
  setTxt('bol-direccion', pedido.direccion);
  setTxt('bol-fecha-entrega', `${pedido.fechaEntrega} (${pedido.horarioEntrega || 'Horario Hábil'})`);

  const tbody = document.getElementById('bol-items-body');
  if (tbody) {
    tbody.innerHTML = '';
    pedido.items.forEach(item => {
      const tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid var(--border-subtle)';
      tr.innerHTML = `
        <td style="padding: 0.8rem 0.5rem; text-align: center; font-weight: 700; color: var(--color-chocolate);">${item.codigo}</td>
        <td style="padding: 0.8rem 0.5rem;">
          <strong>${item.nombre}</strong>
          <br><span style="font-size: 0.82rem; color: var(--text-muted);">${item.personalizacion || 'Estándar'}</span>
        </td>
        <td style="padding: 0.8rem 0.5rem; text-align: center;">${item.cantidad}</td>
        <td style="padding: 0.8rem 0.5rem; text-align: right;">$${item.precio.toLocaleString('es-CL')}</td>
        <td style="padding: 0.8rem 0.5rem; text-align: right; font-weight: 700;">$${(item.precio * item.cantidad).toLocaleString('es-CL')}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  setTxt('bol-subtotal', `$${pedido.subtotal.toLocaleString('es-CL')} CLP`);
  setTxt('bol-envio', `$${pedido.envio.toLocaleString('es-CL')} CLP`);
  setTxt('bol-iva', `$${pedido.iva.toLocaleString('es-CL')} CLP`);
  setTxt('bol-total', `$${pedido.total.toLocaleString('es-CL')} CLP`);

  const filaDesc = document.getElementById('bol-fila-descuento');
  if (filaDesc) {
    if (pedido.montoDescuento > 0) {
      filaDesc.style.display = 'table-row';
      setTxt('bol-motivo-desc', `-${pedido.motivoDescuento || 'Descuento'}`);
      setTxt('bol-monto-desc', `-$${pedido.montoDescuento.toLocaleString('es-CL')} CLP`);
    } else {
      filaDesc.style.display = 'none';
    }
  }

  const btnPrint = document.getElementById('btn-imprimir-boleta');
  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      window.print();
    });
  }
}

// -----------------------------------------------------------------------------
// 4. SEGUIMIENTO DE ENVÍOS (SEGUIMIENTO.HTML)
// -----------------------------------------------------------------------------
function inicializarSeguimiento() {
  const contenedor = document.getElementById('seguimiento-container');
  if (!contenedor) return;

  let pedido = null;
  try {
    pedido = JSON.parse(localStorage.getItem('ultimo_pedido_mil_sabores'));
  } catch (e) {}

  if (!pedido) {
    pedido = {
      folio: 'MS-501995',
      fechaEntrega: new Date().toISOString().split('T')[0],
      horarioEntrega: '14:00 a 18:00 hrs',
      direccion: 'Av. Concha y Toro #1234, Santiago',
      cliente: 'Cliente Estimado',
      estado: 'Decoración'
    };
  }

  const elFolio = document.getElementById('seg-folio-display');
  const elCliente = document.getElementById('seg-cliente-display');
  const elDestino = document.getElementById('seg-destino-display');
  const elHorario = document.getElementById('seg-horario-display');

  if (elFolio) elFolio.textContent = pedido.folio;
  if (elCliente) elCliente.textContent = pedido.cliente;
  if (elDestino) elDestino.textContent = pedido.direccion;
  if (elHorario) elHorario.textContent = `${pedido.fechaEntrega} · ${pedido.horarioEntrega || 'Tarde'}`;

  const estados = [
    { key: 'confirmado', titulo: '1. Pedido Confirmado', desc: 'Tu orden fue ingresada y validada en nuestro taller.' },
    { key: 'preparacion', titulo: '2. En Horneado', desc: 'Nuestros maestros pasteleros están horneando tus bizcochos.' },
    { key: 'decoracion', titulo: '3. Decoración Artesanal', desc: 'Aplicando rellenos de manjar, crema chantilly y dedicatorias.' },
    { key: 'ruta', titulo: '4. En Ruta con Repartidor', desc: 'Tu pedido viaja en furgón refrigerado hacia tu domicilio.' },
    { key: 'entregado', titulo: '5. Entregado con Éxito', desc: '¡Disfruta tus momentos dulces con Pastelería Mil Sabores!' }
  ];

  let estadoActualIndex = 2; // Estado visual interactivo por defecto

  function actualizarVisualizacionEstado(index) {
    estadoActualIndex = index;
    const items = document.querySelectorAll('.tracking-step-item');
    items.forEach((item, i) => {
      item.classList.remove('active', 'completed');
      if (i < index) {
        item.classList.add('completed');
      } else if (i === index) {
        item.classList.add('active');
      }
    });

    const statusBanner = document.getElementById('seg-status-banner');
    if (statusBanner) {
      statusBanner.innerHTML = `
        <h3 style="color: var(--color-chocolate); font-family: var(--font-serif); margin-bottom: 0.3rem;">${estados[index].titulo}</h3>
        <p style="margin: 0; color: var(--text-secondary); font-size: 0.95rem;">${estados[index].desc}</p>
      `;
    }
  }

  const btnsControl = document.querySelectorAll('.btn-simular-estado');
  btnsControl.forEach(btn => {
    btn.addEventListener('click', () => {
      const stepIndex = parseInt(btn.getAttribute('data-step'), 10);
      actualizarVisualizacionEstado(stepIndex);
    });
  });

  actualizarVisualizacionEstado(estadoActualIndex);
}
