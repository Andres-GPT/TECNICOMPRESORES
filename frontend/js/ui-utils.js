/**
 * TECNICOMPRESORES - UI Utilities
 * Funciones de utilidad para mejorar la experiencia de usuario
 */

// =============================================
// Sistema de Notificaciones
// =============================================

/**
 * Muestra una notificación toast en la esquina superior derecha
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duración en ms (default: 3000)
 */
function showToast(message, type = 'info', duration = 3000) {
  // Crear contenedor si no existe
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
    `;
    document.body.appendChild(container);
  }

  // Crear toast
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  // Icono según tipo
  const icons = {
    success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>',
    error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
    warning: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>',
    info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>'
  };

  toast.innerHTML = `
    <div class="toast-icon">${icons[type]}</div>
    <div class="toast-message">${message}</div>
    <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
  `;

  const colors = {
    success: '#1FD000',
    error: '#F44336',
    warning: '#FF9800',
    info: '#2196F3'
  };

  toast.style.cssText = `
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: white;
    border-left: 4px solid ${colors[type]};
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    animation: slideInRight 0.3s ease-out;
  `;

  container.appendChild(toast);

  // Auto-remove
  if (duration > 0) {
    setTimeout(() => {
      toast.style.animation = 'slideOutRight 0.3s ease-in';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
}

// Estilos para las animaciones de toast
if (!document.getElementById('toast-styles')) {
  const style = document.createElement('style');
  style.id = 'toast-styles';
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
    .toast-icon {
      flex-shrink: 0;
    }
    .toast-message {
      flex: 1;
      font-size: 14px;
      color: #333;
    }
    .toast-close {
      background: none;
      border: none;
      font-size: 24px;
      color: #999;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      line-height: 1;
      flex-shrink: 0;
    }
    .toast-close:hover {
      color: #333;
    }
  `;
  document.head.appendChild(style);
}

// =============================================
// Loading Overlay
// =============================================

/**
 * Muestra un overlay de carga
 * @param {string} message - Mensaje opcional
 */
function showLoading(message = 'Cargando...') {
  let overlay = document.getElementById('loading-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
      <div style="text-align: center; color: white;">
        <div class="spinner"></div>
        <p id="loading-message" style="margin-top: 20px; font-size: 16px;">${message}</p>
      </div>
    `;
    document.body.appendChild(overlay);
  } else {
    document.getElementById('loading-message').textContent = message;
    overlay.style.display = 'flex';
  }
}

/**
 * Oculta el overlay de carga
 */
function hideLoading() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    overlay.style.display = 'none';
  }
}

// =============================================
// Confirmación Mejorada
// =============================================

/**
 * Muestra un diálogo de confirmación moderno
 * @param {string} title - Título del diálogo
 * @param {string} message - Mensaje
 * @param {Function} onConfirm - Callback al confirmar
 * @param {Function} onCancel - Callback al cancelar (opcional)
 */
function showConfirmDialog(title, message, onConfirm, onCancel = null) {
  // Crear modal
  const modalId = 'confirm-dialog-' + Date.now();
  const modal = document.createElement('div');
  modal.id = modalId;
  modal.className = 'modal';
  modal.style.display = 'flex';

  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>${title}</h2>
      </div>
      <div class="modal-body">
        <p>${message}</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" id="${modalId}-cancel">Cancelar</button>
        <button class="btn btn-primary" id="${modalId}-confirm">Aceptar</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Event listeners
  document.getElementById(`${modalId}-confirm`).addEventListener('click', () => {
    modal.remove();
    if (onConfirm) onConfirm();
  });

  document.getElementById(`${modalId}-cancel`).addEventListener('click', () => {
    modal.remove();
    if (onCancel) onCancel();
  });

  // Cerrar al hacer clic fuera
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
      if (onCancel) onCancel();
    }
  });
}

// =============================================
// Validación de Formularios
// =============================================

/**
 * Valida un campo de formulario y muestra errores
 * @param {HTMLElement} input - Elemento input
 * @param {Function} validator - Función de validación que retorna {valid: boolean, message: string}
 */
function validateField(input, validator) {
  const result = validator(input.value);
  const errorElement = input.nextElementSibling;

  if (!result.valid) {
    input.style.borderColor = 'var(--color-error)';
    if (errorElement && errorElement.tagName === 'SMALL') {
      errorElement.textContent = result.message;
      errorElement.style.display = 'block';
      errorElement.classList.add('error');
    }
    return false;
  } else {
    input.style.borderColor = 'var(--color-success)';
    if (errorElement && errorElement.tagName === 'SMALL') {
      errorElement.style.display = 'none';
    }
    return true;
  }
}

/**
 * Validadores comunes
 */
const validators = {
  required: (value) => ({
    valid: value.trim() !== '',
    message: 'Este campo es obligatorio'
  }),

  email: (value) => ({
    valid: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value),
    message: 'Correo electrónico inválido'
  }),

  phone: (value) => ({
    valid: /^\d{7,15}$/.test(value),
    message: 'Teléfono inválido (7-15 dígitos)'
  }),

  minLength: (min) => (value) => ({
    valid: value.length >= min,
    message: `Mínimo ${min} caracteres`
  }),

  maxLength: (max) => (value) => ({
    valid: value.length <= max,
    message: `Máximo ${max} caracteres`
  }),

  numeric: (value) => ({
    valid: /^\d+$/.test(value),
    message: 'Solo se permiten números'
  }),

  alphaOnly: (value) => ({
    valid: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value),
    message: 'Solo se permiten letras'
  })
};

// =============================================
// Utilidades para Tablas
// =============================================

/**
 * Resalta una fila de tabla temporalmente
 * @param {HTMLElement} row - Elemento tr
 * @param {string} color - Color de resaltado
 */
function highlightRow(row, color = 'var(--color-secondary-light)') {
  const originalBg = row.style.backgroundColor;
  row.style.backgroundColor = color;
  row.style.transition = 'background-color 0.3s';

  setTimeout(() => {
    row.style.backgroundColor = originalBg;
  }, 1000);
}

/**
 * Añade animación de "añadido recientemente" a una fila
 * @param {HTMLElement} row - Elemento tr
 */
function animateNewRow(row) {
  row.style.animation = 'slideUp 0.4s ease-out';
  highlightRow(row, 'rgba(255, 209, 0, 0.3)');
}

// =============================================
// Debounce para búsquedas
// =============================================

/**
 * Crea una función debounced
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 */
function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// =============================================
// Format de Fechas
// =============================================

/**
 * Formatea una fecha en formato colombiano
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} Fecha formateada
 */
function formatDate(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Formatea una fecha en formato ISO para inputs type="date"
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} Fecha en formato YYYY-MM-DD
 */
function toInputDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// =============================================
// Format de Moneda
// =============================================

/**
 * Formatea un número como moneda colombiana
 * @param {number} amount - Cantidad
 * @returns {string} Cantidad formateada
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(amount);
}

// =============================================
// Copiar al portapapeles
// =============================================

/**
 * Copia texto al portapapeles y muestra feedback
 * @param {string} text - Texto a copiar
 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('Copiado al portapapeles', 'success', 2000);
  } catch (err) {
    showToast('Error al copiar', 'error', 2000);
  }
}

// =============================================
// Exportar a CSV
// =============================================

/**
 * Exporta una tabla a CSV
 * @param {string} tableSelector - Selector de la tabla
 * @param {string} filename - Nombre del archivo
 */
function exportTableToCSV(tableSelector, filename = 'export.csv') {
  const table = document.querySelector(tableSelector);
  if (!table) return;

  let csv = [];
  const rows = table.querySelectorAll('tr');

  rows.forEach(row => {
    const cols = row.querySelectorAll('td, th');
    const rowData = Array.from(cols).map(col => {
      let data = col.textContent.trim();
      // Escapar comillas
      data = data.replace(/"/g, '""');
      // Envolver en comillas si contiene coma
      if (data.includes(',') || data.includes('"')) {
        data = `"${data}"`;
      }
      return data;
    });
    csv.push(rowData.join(','));
  });

  const csvContent = csv.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('Tabla exportada exitosamente', 'success');
}

// =============================================
// Imprimir
// =============================================

/**
 * Imprime un elemento específico
 * @param {string} selector - Selector del elemento a imprimir
 */
function printElement(selector) {
  const element = document.querySelector(selector);
  if (!element) return;

  const printWindow = window.open('', '', 'height=600,width=800');
  printWindow.document.write('<html><head><title>Imprimir</title>');

  // Copiar estilos
  const styles = document.querySelectorAll('link[rel="stylesheet"], style');
  styles.forEach(style => {
    printWindow.document.write(style.outerHTML);
  });

  printWindow.document.write('</head><body>');
  printWindow.document.write(element.innerHTML);
  printWindow.document.write('</body></html>');
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.print();
    printWindow.close();
  };
}

// Exportar funciones globalmente
window.showToast = showToast;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.showConfirmDialog = showConfirmDialog;
window.validateField = validateField;
window.validators = validators;
window.highlightRow = highlightRow;
window.animateNewRow = animateNewRow;
window.debounce = debounce;
window.formatDate = formatDate;
window.toInputDate = toInputDate;
window.formatCurrency = formatCurrency;
window.copyToClipboard = copyToClipboard;
window.exportTableToCSV = exportTableToCSV;
window.printElement = printElement;
