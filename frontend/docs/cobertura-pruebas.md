# Documento de cobertura de pruebas

## Proyecto

**Proyecto:** Pastelería Mil Sabores  
**Evaluación:** Evaluación Parcial 2 — Full Stack 2  
**Fecha de ejecución:** 27 de octubre de 2026  
**Framework de pruebas:** Jasmine con Karma  
**Navegador utilizado:** Microsoft Edge 156.0.0.0 en Windows 10  
**Resultado observado:** 15 de 15 pruebas exitosas

## Objetivo

Registrar los casos de prueba automatizados para comprobar la presentación de productos, las operaciones del repositorio y las funciones de búsqueda y filtrado del catálogo.

## Casos ejecutados

| ID | Componente o módulo | Escenario comprobado | Resultado esperado | Resultado |
|---|---|---|---|---|
| PC-01 | `ProductCard` | Mostrar datos y enlace del producto | Se muestran nombre, imagen, descripción y enlace al detalle con el código correcto | Aprobado |
| RP-01 | `productRepository` | Inicializar el catálogo | Se cargan los 16 productos iniciales | Aprobado |
| RP-02 | `productRepository` | Buscar un producto existente | Se devuelve el producto asociado a su código | Aprobado |
| RP-03 | `productRepository` | Buscar un código inexistente | Se devuelve `null` | Aprobado |
| RP-04 | `productRepository` | Crear un producto | El producto nuevo queda disponible en el repositorio | Aprobado |
| RP-05 | `productRepository` | Crear un producto con código duplicado | Se rechaza la operación y se informa el error | Aprobado |
| RP-06 | `productRepository` | Actualizar un producto | Se guardan los cambios del producto | Aprobado |
| RP-07 | `productRepository` | Actualizar un código inexistente | Se devuelve `null` | Aprobado |
| RP-08 | `productRepository` | Eliminar un producto existente | Se elimina y deja de estar disponible | Aprobado |
| RP-09 | `productRepository` | Eliminar un código inexistente | Se devuelve `false` | Aprobado |
| RP-10 | `productRepository` | Notificar cambios en la lista | Se invoca el suscriptor cuando se modifica el catálogo | Aprobado |
| CP-01 | `CategoriesPage` | Mostrar el catálogo inicial | Aparecen los 16 productos | Aprobado |
| CP-02 | `CategoriesPage` | Filtrar por categoría | Se muestran solamente los productos de la categoría seleccionada | Aprobado |
| CP-03 | `CategoriesPage` | Buscar por nombre | Se muestra el producto coincidente | Aprobado |
| CP-04 | `CategoriesPage` | Buscar sin coincidencias | Se muestra el mensaje de catálogo sin resultados | Aprobado |
| AP-01 | `AdminPage` | Enviar un nombre demasiado corto | Se muestra el error de validación y el catálogo conserva sus 16 productos | Aprobado |
| AP-02 | `AdminPage` | Cancelar la confirmación de eliminación | El mock de `window.confirm` devuelve `false` y el producto permanece en el catálogo | Aprobado |

## Procedimiento de ejecución

1. Abrir una terminal en la carpeta `frontend`.
2. Ejecutar `npm test`.
3. Abrir `http://localhost:9876/` en Microsoft Edge para conectar el navegador a Karma.
4. Revisar el resultado en la terminal.

**Resultado observado:** 
`Executed 11 of 11 SUCCESS` y `TOTAL: 11 SUCCESS` en la primera ejecución; 
después de añadir las pruebas del catálogo, `15 de 15 SUCCESS`;
Tras añadir las 2 pruebas de administracion, `17 de 17 SUCCESS`


## Alcance y limitación

Este documento registra la cobertura de **escenarios funcionales probados**. No representa un porcentaje de cobertura de líneas, ramas o funciones del código, ya que todavía no se ha configurado una herramienta de instrumentación de cobertura.

