# Pastelería Mil Sabores

Proyecto de frontend para Fullstack 2, desarrollado a partir de la plantilla HTML de la primera evaluación y migrado a React para la segunda evaluación parcial.

## Descripción

La aplicación simula una tienda de pastelería con vistas para clientes y administración. Los productos, usuarios, categorías, carrito y pedidos se gestionan desde el frontend y se guardan localmente en el navegador con `localStorage`.

La autenticación y el proceso de pago son simulaciones académicas. El proyecto no integra un backend ni una pasarela de pago real.

## Funcionalidades

### Cliente

- Explorar y buscar productos por categoría.
- Consultar el detalle de un producto.
- Agregar productos al carrito y modificar cantidades.
- Registrarse e iniciar sesión.
- Aplicar descuentos disponibles.
- Completar una compra y consultar su confirmación.
- Revisar el perfil y el historial de compras.
- Consultar ofertas, blogs, contacto y seguimiento de pedidos.

### Administración

- Consultar el dashboard y los reportes.
- Crear, editar y eliminar productos.
- Gestionar categorías y usuarios.
- Consultar pedidos y sus boletas.
- Revisar productos con stock crítico.
- Actualizar el stock; la compra confirmada descuenta las unidades vendidas.

## Tecnologías

- React
- Vite
- React Router
- Bootstrap
- Jasmine y Karma
- `localStorage` como persistencia simulada

## Estructura principal

```text
HTML/                  Plantilla original de la primera evaluación
frontend/
  src/
    components/        Componentes reutilizables
    data/              Datos iniciales del catálogo
    pages/             Vistas de cliente y administración
    services/          Persistencia y reglas de negocio
    tests/             Pruebas unitarias Jasmine/Karma
    
Último resultado registrado: 
**92 pruebas exitosas**. 
Cobertura de los archivos incluidos en el reporte: 
97,28 % de instrucciones, 
89,09 % de ramas, 
95,31 % de funciones y 
98,15 % de líneas.

EJECUCION FRONTEND
cd frontend
npm install
npm run dev

Prueba y Cobertura
npm test
Karma: http://localhost:9876/

Compilacion de produccion
npm run build