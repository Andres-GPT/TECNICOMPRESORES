const inputCedula = document.getElementById("cedula");
const inputFecha = document.getElementById("fecha");
const inputNombre = document.getElementById("nombre");

let maquinasData = []; // Se almacenarán los datos obtenidos de la API

async function mostrarUsuarios() {
  document.addEventListener("DOMContentLoaded", async () => {
    try {
      const response = await fetch(`${link}/maquinas/proceso/2`); // Reemplaza con tu endpoint real
      const data = await response.json();

      if (data.error) {
        console.error("Error obteniendo las máquinas:", data.mensaje);
        return;
      }

      console.log(data.maquinas);

      maquinasData = data.maquinas.map((maquina) => ({
        id: maquina.id,
        cedula: maquina.cedula,
        nombre: maquina.nombre,
        descripcion: maquina.descripcion,
        procedimiento: maquina.procedimiento,
        fecha: maquina.fecha ? formatDate(maquina.fecha) : "Fecha no disponible",
      }));

      console.log(maquinasData);

      renderizarTabla(maquinasData); // Llenamos la tabla con todos los datos
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  });
}

// Función para truncar el texto y agregar "..." si es necesario
function truncarTexto(texto, limite) {
  if (texto.length > limite) {
    return texto.substring(0, limite) + "...";
  }
  return texto;
}

function renderizarTabla(data) {
  const tbody = document.querySelector(".table-custom tbody");

  if (!tbody) {
    console.error("No se encontró el tbody de la tabla.");
    return;
  }

  let filas = "";

  data.forEach((maquina) => {
    // Truncar la descripción y el procedimiento
    const descripcionTruncada = truncarTexto(maquina.descripcion, 50); // Limitar a 50 caracteres
    const procedimientoTruncado = truncarTexto(maquina.procedimiento, 50); // Limitar a 50 caracteres
    filas += `
      <tr data-id="${maquina.id}" data-cedula="${maquina.cedula}">
          <td>${maquina.cedula}</td>
          <td>${maquina.nombre}</td>

          <td>${descripcionTruncada}</td>
          <td>${procedimientoTruncado}</td>
          <td>${maquina.fecha}</td>
      </tr>
    `;
  });

  tbody.innerHTML = filas;

  // Agregar evento de clic a cada fila
  document.querySelectorAll(".table-custom tbody tr").forEach((row) => {
    row.addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      const cedula = this.getAttribute("data-cedula");
      window.location.href = `confirmacion_procedimiento.html#id=${id}&cedula=${cedula}`;
    });
  });
}

// Filtrar por Cédula
function filtroCedula() {
  const cedula = inputCedula.value.trim();
  if (!cedula) {
    renderizarTabla(maquinasData); // Si está vacío, mostrar todos los datos
    return;
  }
  const maquinasFiltradas = maquinasData.filter(
    (maquina) => String(maquina.cedula).includes(cedula)
  );
  renderizarTabla(maquinasFiltradas);
}

function filtroNombre() {
  const nombre = inputNombre.value.trim().toLowerCase(); // Convertir a minúsculas para hacer la búsqueda insensible a mayúsculas
  if (!nombre) {
    renderizarTabla(maquinasData); // Si está vacío, mostrar todos los datos
    return;
  }
  const maquinasFiltradas = maquinasData.filter((maquina) =>
    maquina.nombre.toLowerCase().includes(nombre)
  );
  renderizarTabla(maquinasFiltradas);
}

// Filtrar por Fecha
function filtroFecha() {
  const fecha = inputFecha.value.trim();
  if (!fecha) {
    renderizarTabla(maquinasData); // Si está vacío, mostrar todos los datos
    return;
  }
  const maquinasFiltradas = maquinasData.filter(
    (maquina) => maquina.fecha === fecha
  );
  renderizarTabla(maquinasFiltradas);
}

// Escuchar Enter en los campos de filtro
inputCedula.addEventListener("input", (event) => {
  event.preventDefault();
  filtroCedula();
});

inputNombre.addEventListener("input", (event) => {
  event.preventDefault();
  filtroNombre();
});

inputFecha.addEventListener("input", (event) => {
  event.preventDefault();
  filtroFecha();
});

// Inicializar la carga de datos
mostrarUsuarios();
