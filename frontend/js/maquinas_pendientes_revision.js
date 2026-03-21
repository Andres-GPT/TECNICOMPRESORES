const inputCedula = document.getElementById("cedula");
const inputFecha = document.getElementById("fecha");
const inputNombre = document.getElementById("nombre");

let maquinasData = []; // Se almacenarán los datos obtenidos de la API

async function mostrarUsuarios() {
  document.addEventListener("DOMContentLoaded", async () => {
    try {
      const response = await fetch(`${link}/maquinas/estado/1`); // Reemplaza con tu endpoint real
      const data = await response.json();

      if (data.error) {
        console.error("Error obteniendo las máquinas:", data.mensaje);
        return;
      }

      maquinasData = data.maquinas.map((maquina) => ({
        id: maquina.id,
        cedula: maquina.cedula,
        nombre: maquina.nombre,
        telefono: maquina.telefono,
        correo: maquina.correo,
        direccion: maquina.direccion,
        descripcion: maquina.descripcion,
        observaciones: maquina.observaciones,
        fecha: maquina.fecha ? formatDate(maquina.fecha) : "Fecha no disponible",
      }));

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
    const observacionesTruncada = truncarTexto(maquina.observaciones, 50); // Limitar a 50 caracteres
    filas += `
      <tr data-id="${maquina.id}" data-cedula="${maquina.cedula}">
          <td>${maquina.cedula}</td>
          <td>${maquina.nombre}</td>

          <td>${descripcionTruncada}</td>
          <td>${observacionesTruncada}</td>
          <td>${maquina.fecha}</td>
          <td>
            <button onclick="generarRecibo('${maquina.id}', '${maquina.cedula}', '${maquina.nombre}', '${maquina.telefono}', '${maquina.correo}', '${maquina.direccion}', '${maquina.descripcion}', '${maquina.observaciones}', '${maquina.fecha}')" type="button" class="generar-recibo-btn">Generar Recibo</button>
          </td>
      </tr>
    `;
  });

  tbody.innerHTML = filas;

  // Agregar evento de clic a cada fila (excepto en los inputs)
  document.querySelectorAll(".table-custom tbody tr").forEach((row) => {
    row.addEventListener("click", function (event) {
      if (!event.target.classList.contains("generar-recibo-btn")) {
        const id = this.getAttribute("data-id");
        const cedula = this.getAttribute("data-cedula");
        window.location.href = `/revision_de_maquina.html#id=${id}&cedula=${cedula}`;
      }
    });
  });
}

// Generar Recibo
function generarRecibo(
  idMaquina,
  cedula,
  nombre,

  telefono,
  correo,
  direccion,
  descripcion,
  observaciones,
  fecha
) {
  const reciboDatos = {
    idMaquina: idMaquina,
    cedula: cedula,
    nombre: nombre,
    telefono: telefono,
    correo: correo,
    direccion: direccion,
    descripcion: descripcion,
    observaciones: observaciones,
    fecha: fecha,
  };

  sessionStorage.setItem("reciboDatos", JSON.stringify(reciboDatos));
  location.href = "recibo_registro.html";
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
