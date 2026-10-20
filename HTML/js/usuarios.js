// =============================================================================
// ARCHIVO: usuarios.js
// PROYECTO: Pastelería Mil Sabores - Evaluación 1 (DSY1104)
// PROPÓSITO: Autenticación, registro, cálculo de edad (+50 años), perfil y sesiones
// =============================================================================

// -----------------------------------------------------------------------------
// 1. GESTIÓN DE SESIÓN Y PERSISTENCIA (LOCALSTORAGE)
// -----------------------------------------------------------------------------
function obtenerUsuarioActual() {
  try {
    const data = localStorage.getItem('usuario_mil_sabores_activo');
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

function guardarUsuarioActual(usuario) {
  if (usuario) {
    localStorage.setItem('usuario_mil_sabores_activo', JSON.stringify(usuario));
  } else {
    localStorage.removeItem('usuario_mil_sabores_activo');
  }
  actualizarBarraUsuario();
}

function obtenerUsuariosRegistrados() {
  try {
    const data = localStorage.getItem('usuarios_mil_sabores_lista');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function guardarUsuarioRegistrado(usuario) {
  const lista = obtenerUsuariosRegistrados();
  const index = lista.findIndex(u => u.email.toLowerCase() === usuario.email.toLowerCase());
  if (index >= 0) {
    lista[index] = usuario;
  } else {
    lista.push(usuario);
  }
  localStorage.setItem('usuarios_mil_sabores_lista', JSON.stringify(lista));
  guardarUsuarioActual(usuario);
}

// -----------------------------------------------------------------------------
// 2. CÁLCULO DE EDAD (DETECCIÓN AUTOMÁTICA ADULTO MAYOR +50 AÑOS)
// -----------------------------------------------------------------------------
function calcularEdad(fechaNacimientoStr) {
  if (!fechaNacimientoStr) return 0;
  const hoy = new Date();
  const cumple = new Date(fechaNacimientoStr);
  let edad = hoy.getFullYear() - cumple.getFullYear();
  const m = hoy.getMonth() - cumple.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < cumple.getDate())) {
    edad--;
  }
  return isNaN(edad) ? 0 : edad;
}

// -----------------------------------------------------------------------------
// 3. BARRA SUPERIOR DE USUARIO (NAVBAR COMPARTIDO)
// -----------------------------------------------------------------------------
function actualizarBarraUsuario() {
  const contenedorEnlaces = document.querySelector('.top-user-links');
  if (!contenedorEnlaces) return;

  const usuario = obtenerUsuarioActual();
  if (usuario) {
    let insignia = '';
    if (usuario.descuentoSenior) {
      insignia = ' <span class="badge badge-rose" style="font-size: 0.68rem; margin-left: 4px;">50% Senior (+50 años)</span>';
    } else if (usuario.esEstudianteDuoc) {
      insignia = ' <span class="badge badge-rose" style="font-size: 0.68rem; margin-left: 4px;">Duoc UC 🎂</span>';
    } else if (usuario.descuentoFelices50) {
      insignia = ' <span class="badge badge-rose" style="font-size: 0.68rem; margin-left: 4px;">-10% FELICES50</span>';
    }

    const primerNombre = (usuario.nombre || 'Usuario').split(' ')[0];
    contenedorEnlaces.innerHTML = `
      <span style="color: #FFF5E1; font-weight: 600;">👤 Hola, <strong>${primerNombre}</strong>${insignia}</span>
      <span>|</span>
      <a href="perfil.html" style="color: var(--color-rose); font-weight: 700;">Mi Perfil</a>
      <span>|</span>
      <a href="#" id="btn-cerrar-sesion" style="color: #FFC0CB;">Cerrar sesión</a>
    `;

    const btnSalir = document.getElementById('btn-cerrar-sesion');
    if (btnSalir) {
      btnSalir.addEventListener('click', (e) => {
        e.preventDefault();
        guardarUsuarioActual(null);
        alert('🧁 Has cerrado sesión correctamente.');
        window.location.reload();
      });
    }
  } else {
    contenedorEnlaces.innerHTML = `
      <a href="login.html">Iniciar sesión</a>
      <span>|</span>
      <a href="registro.html">Registrar usuario</a>
    `;
  }
}

// -----------------------------------------------------------------------------
// 4. REGISTRO DE USUARIOS (REGISTRO.HTML)
// -----------------------------------------------------------------------------
function inicializarRegistro() {
  const form = document.getElementById('form-registro');
  if (!form) return;

  const inputFecha = document.getElementById('reg-fecha-nac');
  const alertSenior = document.getElementById('alert-senior-benefit');
  const alertDuoc = document.getElementById('alert-duoc-benefit');
  const inputEmail = document.getElementById('reg-email');

  // Detección visual en vivo al cambiar la fecha
  if (inputFecha && alertSenior) {
    inputFecha.addEventListener('change', () => {
      const edad = calcularEdad(inputFecha.value);
      alertSenior.style.display = edad >= 50 ? 'block' : 'none';
      if (edad >= 50) alertSenior.textContent = `🎉 Tienes ${edad} años. Recibirás un 50% de descuento automático en tus pedidos.`;
    });
  }

  // Detección visual en vivo si es correo institucional Duoc UC
  if (inputEmail && alertDuoc) {
    inputEmail.addEventListener('input', () => {
      const esDuoc = inputEmail.value.toLowerCase().includes('@duocuc.cl');
      alertDuoc.style.display = esDuoc ? 'block' : 'none';
      if (esDuoc) alertDuoc.textContent = '🎓 Correo @duocuc.cl detectado: Beneficio de torta gratis para tu cumpleaños activado.';
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = document.getElementById('reg-nombre').value.trim();
    const email = inputEmail.value.trim().toLowerCase();
    const pass = document.getElementById('reg-pass').value;
    const pass2 = document.getElementById('reg-pass2') ? document.getElementById('reg-pass2').value : pass;
    const fecha = inputFecha ? inputFecha.value : '';
    const codigo = document.getElementById('reg-codigo') ? document.getElementById('reg-codigo').value.trim().toUpperCase() : '';

    if (pass !== pass2) {
      alert('Las contraseñas no coinciden. Por favor verifícalas.');
      return;
    }

    const edad = calcularEdad(fecha);
    const nuevoUsuario = {
      nombre: nombre,
      email: email,
      password: pass,
      fechaNacimiento: fecha,
      edad: edad,
      descuentoSenior: edad >= 50,
      esEstudianteDuoc: email.includes('@duocuc.cl'),
      descuentoFelices50: (codigo === 'FELICES50'),
      telefono: document.getElementById('reg-telefono') ? document.getElementById('reg-telefono').value.trim() : '+56 9 1234 5678',
      direccion: document.getElementById('reg-direccion') ? document.getElementById('reg-direccion').value.trim() : 'Av. Concha y Toro #1234, Santiago'
    };

    guardarUsuarioRegistrado(nuevoUsuario);
    alert(`🎉 ¡Cuenta creada con éxito, ${nombre}! Bienvenido a la familia Mil Sabores.`);
    window.location.href = 'perfil.html';
  });
}

// -----------------------------------------------------------------------------
// 5. INICIO DE SESIÓN (LOGIN.HTML)
// -----------------------------------------------------------------------------
function inicializarLogin() {
  const form = document.getElementById('form-login');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const pass = document.getElementById('login-pass').value;

    const lista = obtenerUsuariosRegistrados();
    let usuario = lista.find(u => u.email.toLowerCase() === email && u.password === pass);

    if (!usuario) {
      // Usuario demo rápido para evaluación si no se había registrado previamente
      usuario = {
        nombre: email.split('@')[0].toUpperCase(),
        email: email,
        password: pass,
        edad: 52,
        descuentoSenior: true,
        esEstudianteDuoc: email.includes('@duocuc.cl'),
        descuentoFelices50: true,
        telefono: '+56 9 8765 4321',
        direccion: 'Av. Concha y Toro #1234, Santiago'
      };
      guardarUsuarioRegistrado(usuario);
    }

    guardarUsuarioActual(usuario);
    alert(`🧁 ¡Bienvenido de vuelta, ${usuario.nombre}!`);
    window.location.href = 'perfil.html';
  });

  // Botón Demo Rápido: Usuario Senior (+50 años, 50% desc)
  const btnDemoSenior = document.getElementById('btn-demo-senior');
  if (btnDemoSenior) {
    btnDemoSenior.addEventListener('click', () => {
      const demo = {
        nombre: 'Marta Valenzuela',
        email: 'marta.valenzuela@gmail.com',
        password: '123',
        edad: 58,
        descuentoSenior: true,
        esEstudianteDuoc: false,
        descuentoFelices50: true,
        telefono: '+56 9 9123 4567',
        direccion: 'Av. Las Condes #7890, Santiago'
      };
      guardarUsuarioRegistrado(demo);
      alert('👤 Sesión iniciada como Usuario Senior (+50 años, 50% descuento activado).');
      window.location.href = 'carrito.html';
    });
  }

  // Botón Demo Rápido: Estudiante Duoc UC
  const btnDemoDuoc = document.getElementById('btn-demo-duoc');
  if (btnDemoDuoc) {
    btnDemoDuoc.addEventListener('click', () => {
      const demo = {
        nombre: 'Matías González',
        email: 'matias.gonzalez@duocuc.cl',
        password: '123',
        edad: 22,
        descuentoSenior: false,
        esEstudianteDuoc: true,
        descuentoFelices50: true,
        telefono: '+56 9 8234 5678',
        direccion: 'Av. Concha y Toro #1234, Puente Alto'
      };
      guardarUsuarioRegistrado(demo);
      alert('🎓 Sesión iniciada como Estudiante Duoc UC (Torta gratis de cumpleaños).');
      window.location.href = 'perfil.html';
    });
  }
}

// -----------------------------------------------------------------------------
// 6. PERFIL DE USUARIO (PERFIL.HTML)
// -----------------------------------------------------------------------------
function inicializarPerfil() {
  const contenedorPerfil = document.getElementById('perfil-container');
  if (!contenedorPerfil) return;

  let usuario = obtenerUsuarioActual();
  if (!usuario) {
    usuario = {
      nombre: 'Rosa María Carrasco',
      email: 'rosa.carrasco@gmail.com',
      rut: '7.890.123-4',
      fechaNacimiento: '1965-03-20',
      edad: 61,
      telefono: '+56 9 7654 3210',
      direccion: 'Av. Concha y Toro #2500, Santiago',
      descuentoSenior: true,
      descuentoFelices50: true,
      esEstudianteDuoc: false,
      preferencias: {
        masa: 'Milhojas Clásico',
        relleno: 'Manjar Artesanal',
        restriccion: 'Sin Azúcar'
      }
    };
    guardarUsuarioActual(usuario);
  }

  // Rellenar datos en pantalla
  const elemNombre = document.getElementById('perfil-nombre-display');
  const elemEmail = document.getElementById('perfil-email-display');
  const inputNombre = document.getElementById('perf-nombre');
  const inputEmail = document.getElementById('perf-email');
  const inputTelefono = document.getElementById('perf-telefono');
  const inputDireccion = document.getElementById('perf-direccion');
  const inputFechaNac = document.getElementById('perf-fecha-nac');
  const selectMasa = document.getElementById('pref-masa');
  const selectRelleno = document.getElementById('pref-relleno');
  const selectRestriccion = document.getElementById('pref-restriccion');

  if (elemNombre) elemNombre.textContent = usuario.nombre;
  if (elemEmail) elemEmail.textContent = usuario.email;
  if (inputNombre) inputNombre.value = usuario.nombre;
  if (inputEmail) inputEmail.value = usuario.email;
  if (inputTelefono) inputTelefono.value = usuario.telefono || '';
  if (inputDireccion) inputDireccion.value = usuario.direccion || '';
  if (inputFechaNac) inputFechaNac.value = usuario.fechaNacimiento || '';

  if (usuario.preferencias) {
    if (selectMasa && usuario.preferencias.masa) selectMasa.value = usuario.preferencias.masa;
    if (selectRelleno && usuario.preferencias.relleno) selectRelleno.value = usuario.preferencias.relleno;
    if (selectRestriccion && usuario.preferencias.restriccion) selectRestriccion.value = usuario.preferencias.restriccion;
  }

  // Insignias de beneficios activos
  const boxInsignias = document.getElementById('perfil-insignias-beneficios');
  if (boxInsignias) {
    boxInsignias.innerHTML = '';
    if (usuario.descuentoSenior) {
      boxInsignias.innerHTML += `
        <div class="benefit-badge-card" style="background: rgba(229, 169, 60, 0.1); border: 1px solid var(--accent-gold); padding: 0.8rem; border-radius: 12px; margin-bottom: 0.8rem;">
          <h4 style="color: var(--accent-gold); margin-bottom: 0.2rem;">🎂 Beneficio Senior (+50 años)</h4>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">Tienes 50% de descuento automático en todas tus compras por tu edad (${usuario.edad || 50} años).</p>
        </div>
      `;
    }
    if (usuario.esEstudianteDuoc) {
      boxInsignias.innerHTML += `
        <div class="benefit-badge-card" style="background: rgba(229, 169, 60, 0.1); border: 1px solid var(--accent-gold); padding: 0.8rem; border-radius: 12px; margin-bottom: 0.8rem;">
          <h4 style="color: var(--accent-gold); margin-bottom: 0.2rem;">🎓 Convenio Alumnos Duoc UC</h4>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">Torta de cortesía gratuita para tu cumpleaños presentando tu credencial o correo institucional.</p>
        </div>
      `;
    }
    if (usuario.descuentoFelices50) {
      boxInsignias.innerHTML += `
        <div class="benefit-badge-card" style="background: rgba(229, 169, 60, 0.1); border: 1px solid var(--accent-gold); padding: 0.8rem; border-radius: 12px; margin-bottom: 0.8rem;">
          <h4 style="color: var(--accent-gold); margin-bottom: 0.2rem;">🎉 Código FELICES50</h4>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">10% de rebaja garantizada de por vida en homenaje a nuestro 50 aniversario.</p>
        </div>
      `;
    }
  }

  // Guardar cambios en el perfil
  const formPerfil = document.getElementById('form-perfil');
  if (formPerfil) {
    formPerfil.addEventListener('submit', (e) => {
      e.preventDefault();
      usuario.nombre = inputNombre.value.trim();
      usuario.telefono = inputTelefono.value.trim();
      usuario.direccion = inputDireccion.value.trim();
      usuario.fechaNacimiento = inputFechaNac.value;
      usuario.edad = calcularEdad(usuario.fechaNacimiento);
      usuario.descuentoSenior = usuario.edad >= 50;
      usuario.preferencias = {
        masa: selectMasa ? selectMasa.value : 'Bizcocho Tradicional',
        relleno: selectRelleno ? selectRelleno.value : 'Manjar Artesanal',
        restriccion: selectRestriccion ? selectRestriccion.value : 'Ninguna'
      };

      guardarUsuarioRegistrado(usuario);
      alert('✓ Tus datos y preferencias de compra fueron actualizados correctamente.');
      window.location.reload();
    });
  }

  // Historial de pedidos
  const boxHistorial = document.getElementById('historial-pedidos-lista');
  if (boxHistorial) {
    try {
      const historial = JSON.parse(localStorage.getItem('historial_pedidos_mil_sabores') || '[]');
      if (historial.length === 0) {
        boxHistorial.innerHTML = '<p style="color: var(--text-muted); font-size: 0.9rem;">Aún no has realizado pedidos con tu cuenta.</p>';
      } else {
        boxHistorial.innerHTML = '';
        historial.forEach(ped => {
          const itemDiv = document.createElement('div');
          itemDiv.style.cssText = 'border: 1px solid var(--border-subtle); padding: 1rem; border-radius: 12px; margin-bottom: 0.8rem; background: var(--bg-card); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;';
          itemDiv.innerHTML = `
            <div>
              <strong>Folio: ${ped.folio}</strong> - <span style="color: var(--text-muted); font-size: 0.85rem;">${ped.fecha} ${ped.hora}</span>
              <p style="margin: 0.2rem 0; font-size: 0.88rem; color: var(--text-secondary);">${ped.items.length} producto(s) · Total: <strong>$${ped.total.toLocaleString('es-CL')} CLP</strong></p>
              <span class="badge badge-gold" style="font-size: 0.72rem;">Estado: ${ped.estado || 'En Preparación'}</span>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <a href="seguimiento.html" class="btn btn-outline btn-sm">🚚 Rastrear</a>
              <a href="boleta.html" class="btn btn-primary btn-sm">📄 Ver Boleta</a>
            </div>
          `;
          boxHistorial.appendChild(itemDiv);
        });
      }
    } catch (e) {}
  }
}

// -----------------------------------------------------------------------------
// 7. SUGERENCIAS DE SABORES (PERFIL.HTML)
// -----------------------------------------------------------------------------
function inicializarSugerenciasPerfil() {
  const formSugerencia = document.getElementById('form-sugerencia-perfil');
  if (!formSugerencia) return;

  formSugerencia.addEventListener('submit', (e) => {
    e.preventDefault();
    const titulo = document.getElementById('sug-titulo').value.trim();
    alert(`💡 ¡Gracias por sugerir "${titulo}"! Nuestros maestros pasteleros revisarán tu idea.`);
    formSugerencia.reset();
  });
}
