const searchInput = document.getElementById("search");
const tbody = document.getElementById("clientes-tbody");
const btnPrev = document.getElementById("btn-prev");
const btnNext = document.getElementById("btn-next");
const pageNumbers = document.getElementById("page-numbers");
const paginationInfo = document.getElementById("pagination-info");

let currentPage = 1;
let totalPages = 1;
let itemsPerPage = 20;
let totalItems = 0;
let searchTerm = "";

// Debounce function para optimizar búsqueda
let searchTimeout;
function debounce(func, delay) {
  return function (...args) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => func.apply(this, args), delay);
  };
}

// Cargar clientes del servidor
async function cargarClientes() {
  try {
    const params = new URLSearchParams({
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm,
    });

    const response = await fetch(`${link}/clientes?${params}`);
    const data = await response.json();

    if (data.error) {
      console.error("Error obteniendo clientes:", data.mensaje);
      tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Error al cargar clientes</td></tr>';
      return;
    }

    const { clientes, pagination } = data;
    totalPages = pagination.totalPages;
    totalItems = pagination.totalItems;
    currentPage = pagination.currentPage;
    itemsPerPage = pagination.itemsPerPage;

    renderizarTabla(clientes);
    renderizarPaginacion();
    actualizarInfoPaginacion();
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Error de conexión</td></tr>';
  }
}

// Renderizar tabla de clientes
function renderizarTabla(clientes) {
  if (!tbody) {
    console.error("No se encontró el tbody de la tabla.");
    return;
  }

  if (clientes.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No se encontraron clientes</td></tr>';
    return;
  }

  let filas = "";
  clientes.forEach((cliente) => {
    filas += `
      <tr data-cedula="${cliente.cedula}" style="cursor: pointer;">
          <td>${cliente.cedula || ""}</td>
          <td>${cliente.nombre || ""}</td>
          <td>${cliente.apellido || ""}</td>
          <td>${cliente.telefono || ""}</td>
          <td>${cliente.correo || ""}</td>
      </tr>
    `;
  });

  tbody.innerHTML = filas;

  // Agregar evento de clic a cada fila
  document.querySelectorAll("#clientes-tbody tr").forEach((row) => {
    row.addEventListener("click", function () {
      const cedula = this.getAttribute("data-cedula");
      window.location.href = `editar_cliente.html#cedula=${cedula}`;
    });
  });
}

// Renderizar botones de paginación
function renderizarPaginacion() {
  // Actualizar botones anterior/siguiente
  btnPrev.disabled = currentPage === 1;
  btnNext.disabled = currentPage === totalPages || totalPages === 0;

  // Renderizar números de página
  pageNumbers.innerHTML = "";

  if (totalPages <= 7) {
    // Mostrar todas las páginas si son 7 o menos
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.appendChild(crearBotonPagina(i));
    }
  } else {
    // Mostrar páginas con ellipsis cuando hay muchas
    pageNumbers.appendChild(crearBotonPagina(1));

    if (currentPage > 3) {
      pageNumbers.appendChild(crearEllipsis());
    }

    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pageNumbers.appendChild(crearBotonPagina(i));
    }

    if (currentPage < totalPages - 2) {
      pageNumbers.appendChild(crearEllipsis());
    }

    pageNumbers.appendChild(crearBotonPagina(totalPages));
  }
}

// Crear botón de página
function crearBotonPagina(pageNum) {
  const btn = document.createElement("button");
  btn.className = `page-btn ${pageNum === currentPage ? "active" : ""}`;
  btn.textContent = pageNum;
  btn.onclick = () => irAPagina(pageNum);
  return btn;
}

// Crear ellipsis
function crearEllipsis() {
  const span = document.createElement("span");
  span.textContent = "...";
  span.style.padding = "0 8px";
  span.style.color = "var(--text-secondary)";
  return span;
}

// Actualizar información de paginación
function actualizarInfoPaginacion() {
  if (totalItems === 0) {
    paginationInfo.textContent = "No hay clientes para mostrar";
  } else {
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);
    paginationInfo.textContent = `Mostrando ${start} a ${end} de ${totalItems} clientes`;
  }
}

// Navegar a una página específica
function irAPagina(pageNum) {
  if (pageNum >= 1 && pageNum <= totalPages) {
    currentPage = pageNum;
    cargarClientes();
  }
}

// Página anterior
btnPrev.addEventListener("click", () => {
  if (currentPage > 1) {
    irAPagina(currentPage - 1);
  }
});

// Página siguiente
btnNext.addEventListener("click", () => {
  if (currentPage < totalPages) {
    irAPagina(currentPage + 1);
  }
});

// Búsqueda en tiempo real con debounce
searchInput.addEventListener(
  "input",
  debounce((event) => {
    searchTerm = event.target.value.trim();
    currentPage = 1; // Resetear a la primera página al buscar
    cargarClientes();
  }, 300)
);

// Cargar clientes al inicio
document.addEventListener("DOMContentLoaded", () => {
  cargarClientes();
});
