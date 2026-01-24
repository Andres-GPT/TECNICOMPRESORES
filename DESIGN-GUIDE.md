# Guía de Diseño - TECNICOMPRESORES

Esta guía documenta el sistema de diseño implementado para la aplicación web de TECNICOMPRESORES DEL NORTE SAS.

## Tabla de Contenidos

1. [Paleta de Colores](#paleta-de-colores)
2. [Tipografía](#tipografía)
3. [Componentes](#componentes)
4. [Estilos de Página](#estilos-de-página)
5. [Utilidades JavaScript](#utilidades-javascript)
6. [Patrones de Uso](#patrones-de-uso)

---

## Paleta de Colores

Los colores están basados en el logo de TECNICOMPRESORES:

### Colores Principales

```css
--color-primary: #E31E24        /* Rojo TCDN */
--color-primary-dark: #B71A1F   /* Rojo oscuro */
--color-primary-light: #FF3B41  /* Rojo claro */

--color-secondary: #FFD100      /* Amarillo TCDN */
--color-secondary-dark: #E6BC00 /* Amarillo oscuro */
--color-secondary-light: #FFDD33 /* Amarillo claro */

--color-dark: #1A1A1A           /* Negro del logo */
--color-dark-gray: #3C3C3C      /* Gris oscuro */
--color-medium-gray: #6B6B6B    /* Gris medio */
```

### Colores Neutrales

```css
--color-white: #FFFFFF
--color-background: #F5F5F5
--color-light-gray: #E5E5E5
--color-border: #D9D9D9
```

### Colores de Estado

```css
--color-success: #1FD000
--color-warning: #FF9800
--color-error: #F44336
--color-info: #2196F3
```

### Uso de Colores

- **Rojo primario**: Títulos, botones principales, elementos de marca
- **Amarillo**: Acentos, bordes decorativos, números importantes
- **Negro/Grises**: Texto, fondos, elementos secundarios
- **Colores de estado**: Feedback, notificaciones, estados de máquinas

---

## Tipografía

### Fuente

```css
--font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
```

### Tamaños

```css
--font-size-xs: 0.75rem   /* 12px */
--font-size-sm: 0.875rem  /* 14px */
--font-size-md: 1rem      /* 16px - Base */
--font-size-lg: 1.125rem  /* 18px */
--font-size-xl: 1.5rem    /* 24px */
--font-size-xxl: 2rem     /* 32px */
```

### Jerarquía

```html
<h1>Título Principal</h1>      <!-- 32px, rojo -->
<h2>Título Secundario</h2>     <!-- 24px, rojo -->
<h3>Subtítulo</h3>             <!-- 18px, gris oscuro -->
<p>Texto normal</p>             <!-- 16px, negro -->
<small>Texto pequeño</small>    <!-- 14px -->
```

---

## Componentes

### Header

El header es consistente en todas las páginas:

```html
<header>
  <div class="header-content">
    <div id="logo" onclick="location.href='index.html'">
      <img src="img/logo.png" alt="Logo Tecnicompresores">
      <span>TECNICOMPRESORES DEL NORTE SAS</span>
    </div>
    <nav>
      <a href="index.html" class="active">Inicio</a>
      <a href="registro.html">Registro</a>
      <a href="maquinas.html">Máquinas</a>
      <a href="configurar_recibo.html">Configuración</a>
      <a href="tecnicos.html">Técnicos</a>
    </nav>
  </div>
</header>
```

**Características:**
- Fondo degradado negro
- Logo clickeable que regresa al inicio
- Navegación con efecto hover y subrayado amarillo
- Clase `active` para la página actual
- Sticky en la parte superior

### Botones

#### Clases Disponibles

```html
<!-- Botón primario (rojo) -->
<button class="btn btn-primary">Guardar</button>

<!-- Botón secundario (amarillo) -->
<button class="btn btn-secondary">Secundario</button>

<!-- Botón de éxito (verde) -->
<button class="btn btn-success">Confirmar</button>

<!-- Botón outline (borde rojo) -->
<button class="btn btn-outline">Eliminar</button>

<!-- Botón ghost (gris claro) -->
<button class="btn btn-ghost">Cancelar</button>

<!-- Tamaños -->
<button class="btn btn-primary btn-sm">Pequeño</button>
<button class="btn btn-primary">Normal</button>
<button class="btn btn-primary btn-lg">Grande</button>
```

#### Con Iconos

```html
<button class="btn btn-primary">
  <svg>...</svg>
  Nuevo Registro
</button>
```

### Cards

#### Card Básica

```html
<div class="card">
  <h3>Título</h3>
  <p>Contenido de la card</p>
</div>
```

#### Card con Header

```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Título</h3>
  </div>
  <p>Contenido</p>
</div>
```

#### Card Clickeable

```html
<div class="card card-clickable" onclick="location.href='destino.html'">
  <h3>Título</h3>
  <p>Contenido</p>
</div>
```

#### Grid de Cards

```html
<div class="cards-grid">
  <div class="card">...</div>
  <div class="card">...</div>
  <div class="card">...</div>
</div>
```

### Formularios

#### Estructura Básica

```html
<div class="form-container">
  <div class="form-section">
    <h3>Sección del Formulario</h3>

    <div class="form-group">
      <label for="input-id">Etiqueta</label>
      <input type="text" id="input-id" name="nombre">
      <small class="error">Mensaje de error</small>
    </div>

    <div class="form-group">
      <label for="textarea-id">Descripción</label>
      <textarea id="textarea-id" name="descripcion"></textarea>
    </div>

    <div class="form-group">
      <label for="select-id">Selección</label>
      <select id="select-id" name="opcion">
        <option value="1">Opción 1</option>
        <option value="2">Opción 2</option>
      </select>
    </div>
  </div>

  <div class="button-container">
    <button type="submit" class="btn btn-primary">Enviar</button>
  </div>
</div>
```

#### Formulario de Dos Columnas

```html
<div class="form-container" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
  <div class="form-section">
    <h3>Columna Izquierda</h3>
    <!-- Campos -->
  </div>

  <div class="form-section">
    <h3>Columna Derecha</h3>
    <!-- Campos -->
  </div>
</div>
```

### Tablas

```html
<table class="table-custom">
  <thead>
    <tr>
      <th>Columna 1</th>
      <th>Columna 2</th>
      <th>Acciones</th>
    </tr>
  </thead>
  <tbody>
    <tr class="clickable" onclick="handleClick()">
      <td>Dato 1</td>
      <td>Dato 2</td>
      <td>
        <button class="btn btn-sm btn-success">Acción</button>
      </td>
    </tr>
  </tbody>
</table>
```

**Características:**
- Header con degradado rojo
- Filas con efecto hover
- Zebra striping automático
- Bordes suaves
- Sombra

### Filtros

```html
<div class="filtros">
  <h3 class="filtros-title">Filtros</h3>

  <div class="filtros-grid">
    <div class="filtro-group">
      <label for="filtro1">Documento</label>
      <input type="text" id="filtro1" placeholder="Ingrese documento">
    </div>

    <div class="filtro-group">
      <label for="filtro2">Fecha</label>
      <input type="date" id="filtro2">
    </div>

    <div class="filtro-group">
      <label for="filtro3">Estado</label>
      <select id="filtro3">
        <option value="">Todos</option>
        <option value="1">Opción 1</option>
      </select>
    </div>
  </div>
</div>
```

### Modales

```html
<div id="modal-id" class="modal">
  <div class="modal-content">
    <div class="modal-header">
      <h2>Título del Modal</h2>
    </div>

    <div class="modal-body">
      <p>Contenido del modal</p>
    </div>

    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-primary" onclick="confirm()">Aceptar</button>
    </div>
  </div>
</div>
```

**JavaScript para controlar:**

```javascript
// Mostrar
document.getElementById('modal-id').classList.add('show');
// o
document.getElementById('modal-id').style.display = 'flex';

// Ocultar
document.getElementById('modal-id').classList.remove('show');
// o
document.getElementById('modal-id').style.display = 'none';
```

### Badges

```html
<span class="badge badge-primary">Primario</span>
<span class="badge badge-secondary">Secundario</span>
<span class="badge badge-success">Éxito</span>
<span class="badge badge-warning">Advertencia</span>
<span class="badge badge-error">Error</span>
```

### Alertas

```html
<div class="alert alert-success">Operación exitosa</div>
<div class="alert alert-warning">Advertencia importante</div>
<div class="alert alert-error">Error detectado</div>
<div class="alert alert-info">Información adicional</div>
```

---

## Estilos de Página

### Página de Inicio (Dashboard)

Elementos específicos:
- `.stats-grid`: Grid responsive para tarjetas de estadísticas
- `.stat-card`: Tarjetas de estadísticas con iconos
- `.stat-icon`: Contenedor del icono con color distintivo
- `.quick-actions`: Sección de acciones rápidas
- `.actions-grid`: Grid para botones de acción

### Páginas de Listado

Elementos comunes:
- `.page-header`: Encabezado con título y botón de acción
- `.filtros`: Sección de filtros
- `.table-custom`: Tabla de datos

### Páginas de Formulario

Elementos comunes:
- `.form-container`: Contenedor principal del formulario
- `.form-section`: Secciones del formulario
- `.button-container`: Contenedor de botones (alineado a la derecha)

---

## Utilidades JavaScript

El archivo `ui-utils.js` provee funciones útiles:

### Notificaciones Toast

```javascript
// Éxito
showToast('Operación exitosa', 'success');

// Error
showToast('Ocurrió un error', 'error');

// Advertencia
showToast('Ten cuidado', 'warning');

// Información
showToast('Información importante', 'info');

// Duración personalizada
showToast('Mensaje', 'success', 5000); // 5 segundos
```

### Loading Overlay

```javascript
// Mostrar
showLoading('Guardando...');

// Ocultar
hideLoading();

// Ejemplo con async/await
async function guardar() {
  showLoading('Guardando datos...');
  try {
    await fetch('...');
    showToast('Guardado exitosamente', 'success');
  } catch (error) {
    showToast('Error al guardar', 'error');
  } finally {
    hideLoading();
  }
}
```

### Diálogos de Confirmación

```javascript
showConfirmDialog(
  '¿Eliminar máquina?',
  '¿Estás seguro de que deseas eliminar esta máquina? Esta acción no se puede deshacer.',
  () => {
    // Al confirmar
    eliminarMaquina();
  },
  () => {
    // Al cancelar (opcional)
    console.log('Cancelado');
  }
);
```

### Validación de Formularios

```javascript
// Validar un campo
const input = document.getElementById('email');
const isValid = validateField(input, validators.email);

// Validadores disponibles:
validators.required(value)
validators.email(value)
validators.phone(value)
validators.minLength(min)(value)
validators.maxLength(max)(value)
validators.numeric(value)
validators.alphaOnly(value)

// Validador personalizado
validateField(input, (value) => ({
  valid: value.length >= 5,
  message: 'Mínimo 5 caracteres'
}));
```

### Utilidades de Tabla

```javascript
// Resaltar fila
const row = document.querySelector('tr');
highlightRow(row);

// Animar nueva fila
animateNewRow(row);

// Exportar tabla a CSV
exportTableToCSV('.table-custom', 'maquinas.csv');
```

### Formato de Datos

```javascript
// Fecha
formatDate('2025-03-15');  // "15/03/2025"
toInputDate(new Date());    // "2025-03-15"

// Moneda
formatCurrency(50000);      // "$50.000"

// Copiar al portapapeles
copyToClipboard('Texto a copiar');
```

### Debounce (para búsquedas)

```javascript
const buscar = debounce((texto) => {
  // Realizar búsqueda
  fetch(`/api/buscar?q=${texto}`);
}, 300); // Espera 300ms después de que el usuario deja de escribir

inputBusqueda.addEventListener('input', (e) => {
  buscar(e.target.value);
});
```

---

## Patrones de Uso

### Estructura HTML Estándar

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- IMPORTANTE: global.css siempre va primero -->
    <link rel="stylesheet" href="css/global.css">
    <link rel="stylesheet" href="css/pagina-especifica.css">
    <script src="js/config.js"></script>
    <script src="js/ui-utils.js"></script>
    <title>Título Descriptivo - Tecnicompresores</title>
</head>
<body>
    <header>
        <div class="header-content">
            <!-- Header content -->
        </div>
    </header>

    <div class="container">
        <!-- Page content -->
    </div>

    <script src="js/pagina-especifica.js"></script>
</body>
</html>
```

### CSS de Página Específica

```css
/* Estilos específicos para [nombre-pagina].html */

/* Solo incluir estilos únicos de esta página */
/* Todos los estilos comunes están en global.css */

.mi-clase-especifica {
  /* Usar variables CSS */
  color: var(--color-primary);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-normal);
}

.otra-clase {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
}

/* Responsive */
@media (max-width: 768px) {
  .mi-clase-especifica {
    padding: var(--spacing-sm);
  }
}
```

### Patrón de Fetch con Feedback

```javascript
async function guardarDatos(datos) {
  showLoading('Guardando...');

  try {
    const response = await fetch(`${link}/endpoint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });

    const result = await response.json();

    if (result.error) {
      showToast(result.mensaje, 'error');
      return;
    }

    showToast('Guardado exitosamente', 'success');
    // Redireccionar o actualizar UI
    setTimeout(() => {
      location.href = 'otra-pagina.html';
    }, 1000);

  } catch (error) {
    console.error('Error:', error);
    showToast('Error al conectar con el servidor', 'error');
  } finally {
    hideLoading();
  }
}
```

### Patrón de Formulario con Validación

```javascript
const form = document.getElementById('mi-formulario');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Validar campos
  const nombre = document.getElementById('nombre');
  const email = document.getElementById('email');

  let isValid = true;
  isValid = validateField(nombre, validators.required) && isValid;
  isValid = validateField(email, validators.email) && isValid;

  if (!isValid) {
    showToast('Por favor corrige los errores', 'warning');
    return;
  }

  // Procesar formulario
  const datos = {
    nombre: nombre.value,
    email: email.value
  };

  await guardarDatos(datos);
});
```

---

## Espaciado

Use las variables de espaciado para consistencia:

```css
/* Espaciado disponible */
var(--spacing-xs)   /* 4px */
var(--spacing-sm)   /* 8px */
var(--spacing-md)   /* 16px */
var(--spacing-lg)   /* 24px */
var(--spacing-xl)   /* 32px */
var(--spacing-xxl)  /* 48px */

/* Clases de utilidad */
.mt-md { margin-top: var(--spacing-md); }
.mb-lg { margin-bottom: var(--spacing-lg); }
.gap-md { gap: var(--spacing-md); }
/* etc. */
```

---

## Responsive Design

Breakpoint principal:

```css
@media (max-width: 768px) {
  /* Estilos para móvil */
}
```

El sistema ya incluye responsive design en:
- Header (se apila en móvil)
- Grids (se convierten en una columna)
- Tablas (padding reducido)
- Formularios (columnas se apilan)

---

## Buenas Prácticas

1. **Siempre importar global.css primero**
   ```html
   <link rel="stylesheet" href="css/global.css">
   <link rel="stylesheet" href="css/mi-pagina.css">
   ```

2. **Usar variables CSS en lugar de valores hardcoded**
   ```css
   /* ❌ Mal */
   color: #E31E24;

   /* ✅ Bien */
   color: var(--color-primary);
   ```

3. **Usar clases de componentes existentes**
   ```html
   <!-- ❌ Mal -->
   <button style="background: red; padding: 10px;">Click</button>

   <!-- ✅ Bien -->
   <button class="btn btn-primary">Click</button>
   ```

4. **Proveer feedback visual**
   ```javascript
   // ❌ Mal
   await fetch('/api/endpoint');

   // ✅ Bien
   showLoading();
   await fetch('/api/endpoint');
   hideLoading();
   showToast('Éxito', 'success');
   ```

5. **Validar antes de enviar**
   ```javascript
   // Siempre validar inputs del usuario
   if (!validateField(input, validators.required)) {
     return;
   }
   ```

6. **Accessibility**
   - Usar etiquetas semánticas HTML5
   - Incluir atributos `alt` en imágenes
   - Labels para todos los inputs
   - Títulos descriptivos en páginas

---

## Migración de Páginas Antiguas

Para actualizar una página antigua al nuevo sistema:

1. Añadir `<link rel="stylesheet" href="css/global.css">`
2. Actualizar estructura del header
3. Cambiar botones a usar clases `btn`
4. Actualizar tablas a `table-custom`
5. Actualizar formularios a usar `form-container`
6. Eliminar CSS duplicado del archivo específico
7. Reemplazar colores hardcoded con variables
8. Añadir `ui-utils.js` y usar sus funciones

---

## Recursos

- **Archivo principal**: `frontend/css/global.css`
- **Utilidades JS**: `frontend/js/ui-utils.js`
- **Ejemplos de referencia**: `index.html`, `registro.html`, `maquinas_pendientes_revision.html`
- **Logo**: `frontend/img/logo.png`

---

## Soporte

Para preguntas o sugerencias sobre el sistema de diseño, consultar con el equipo de desarrollo.

**Última actualización**: Diciembre 2025
