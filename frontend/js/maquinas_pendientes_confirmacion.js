const inputCedula = document.getElementById("cedula");
const inputFecha = document.getElementById("fecha");

let maquinasData = []; // Se almacenarán los datos obtenidos de la API

async function mostrarUsuarios() {
  document.addEventListener("DOMContentLoaded", async () => {
    try {
      const response = await fetch(`${link}/maquinas/estado/2`); // Reemplaza con tu endpoint real
      const data = await response.json();

      if (data.error) {
        console.error("Error obteniendo las máquinas:", data.mensaje);
        return;
      }

      // Guardamos los datos en la variable global
      maquinasData = data.maquinas.map(maquina => ({
        id: maquina.id,
        cedula: maquina.cedula,
        nombre: maquina.nombre,
        apellido: maquina.apellido,
        descripcion: maquina.descripcion,
        observaciones: maquina.observaciones,
        fecha: maquina.fecha 
      }));

      renderizarTabla(maquinasData); // Llenamos la tabla con todos los datos

    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  });
}

function renderizarTabla(data) {
  const tbody = document.querySelector(".table-custom tbody");

  if (!tbody) {
    console.error("No se encontró el tbody de la tabla.");
    return;
  }

  let filas = "";

  data.forEach((maquina) => {
    filas += `
      <tr data-id="${maquina.id}" data-cedula="${maquina.cedula}">
          <td>${maquina.cedula}</td>
          <td>${maquina.nombre}</td>
          <td>${maquina.apellido}</td>
          <td>${maquina.descripcion}</td>
          <td>${maquina.observaciones}</td>
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
  const maquinasFiltradas = maquinasData.filter(maquina => maquina.cedula == cedula);
  renderizarTabla(maquinasFiltradas);
}

// Filtrar por Fecha
function filtroFecha() {
  const fecha = inputFecha.value.trim();
  if (!fecha) {
    renderizarTabla(maquinasData); // Si está vacío, mostrar todos los datos
    return;
  }
  const maquinasFiltradas = maquinasData.filter(maquina => maquina.fecha === fecha);
  renderizarTabla(maquinasFiltradas);
}

// Escuchar Enter en los campos de filtro
inputCedula.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    filtroCedula();
  }
});

inputFecha.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    filtroFecha();
  }
});

// Inicializar la carga de datos
mostrarUsuarios();
