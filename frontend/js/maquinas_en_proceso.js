const inputCedula = document.getElementById("cedula");
const inputFecha = document.getElementById("fecha");
const inputNombre = document.getElementById("nombre");
const filtroGarantia = document.getElementById("filtroGarantia");

let maquinasData = [];
let idMaquinaSeleccionada = null; // Se almacenará el ID de la máquina seleccionada

// Elementos del modal
const modal = document.getElementById("modalEstanteNivel");
const inputEstante = document.getElementById("inputEstante");
const inputNivel = document.getElementById("inputNivel");
const btnConfirmar = document.getElementById("btnConfirmar");
const closeModal = document.querySelector(".close");

// Evento para el checkbox de garantía
filtroGarantia.addEventListener("change", () => {
  aplicarFiltros();
});

// validar el estante y nivel
inputEstante.addEventListener("input", function () {
  if (this.value.length > 10) {
    this.value = this.value.slice(0, 10);
    document.getElementById("inputEstante-error").style.display = "block";
  } else {
    document.getElementById("inputEstante-error").style.display = "none";
  }
});

inputNivel.addEventListener("input", function () {
  if (this.value.length > 10) {
    this.value = this.value.slice(0, 10);
    document.getElementById("inputNivel-error").style.display = "block";
  } else {
    document.getElementById("inputNivel-error").style.display = "none";
  }
});

// Mostrar datos al cargar la página
document.addEventListener("DOMContentLoaded", async () => {
  await mostrarUsuarios();
});

// Obtener datos de la API
async function mostrarUsuarios() {
  try {
    const response = await fetch(`${link}/maquinas/proceso/3`);
    const data = await response.json();
    console.log(data.maquinas);

    if (data.error) {
      console.error("Error obteniendo las máquinas:", data.mensaje);
      return;
    }

    maquinasData = data.maquinas.map((maquina) => ({
      id: maquina.id,
      cedula: maquina.cedula,
      nombre: maquina.nombre,
      apellido: maquina.apellido,
      descripcion: maquina.descripcion,
      procedimiento: maquina.procedimiento,
      fecha: maquina.fecha,
      garantia: maquina.garantia || "no", // Asegúrate de que garantía tenga un valor por defecto
    }));

    aplicarFiltros(); // Renderizar la tabla con los datos iniciales
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }
}

// Función para truncar el texto y agregar "..." si es necesario
function truncarTexto(texto, limite) {
  if (texto.length > limite) {
    return texto.substring(0, limite) + "...";
  }
  return texto;
}

// Renderizar la tabla con los datos
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
          <td>${maquina.apellido}</td>
          <td>${descripcionTruncada}</td>
          <td>${procedimientoTruncado}</td>
          <td>${maquina.garantia}</td>
          <td>${maquina.fecha}</td>
          <td>
              <button class="btn-accion" data-id="${maquina.id}">Confirmar</button>
          </td>
      </tr>
    `;
  });

  tbody.innerHTML = filas;

  // Agregar evento de clic a cada fila
  document.querySelectorAll(".table-custom tbody tr").forEach((row) => {
    row.addEventListener("click", function (event) {
      if (!event.target.classList.contains("btn-accion")) {
        const id = this.getAttribute("data-id");
        const cedula = this.getAttribute("data-cedula");
        window.location.href = `/confirmar_terminar_proceso.html#id=${id}&cedula=${cedula}`;
      }
    });
  });

  // Agregar eventos a los botones de acción
  document.querySelectorAll(".btn-accion").forEach((button) => {
    button.addEventListener("click", (event) => {
      idMaquinaSeleccionada = event.target.dataset.id;
      abrirModal();
    });
  });
}
// Abrir el modal
function abrirModal() {
  modal.style.display = "block";
}

// Cerrar el modal
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

// Confirmar y enviar los datos
btnConfirmar.addEventListener("click", async () => {
  if (!idMaquinaSeleccionada) return;

  const estante = inputEstante.value.trim();
  const nivel = inputNivel.value.trim();

  if (!estante || !nivel) {
    alert("Por favor ingrese estante y nivel.");
    return;
  }

  try {
    // 1. Actualizar el estado de la máquina
    const responsePut = await fetch(
      `${link}/maquinas/${idMaquinaSeleccionada}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          estado: "pendiente por recoger",
          estante,
          nivel,
        }),
      }
    );

    if (!responsePut.ok) throw new Error("Error al actualizar la máquina.");

    // 2. Registrar el recibo
    const responsePost = await fetch(`${link}/recibos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_maquina: idMaquinaSeleccionada }),
    });

    if (!responsePost.ok) throw new Error("Error al registrar el recibo.");

    // Cerrar modal y limpiar inputs
    modal.style.display = "none";
    inputEstante.value = "";
    inputNivel.value = "";

    // redireccionar al index
    location.href = "index.html";
  } catch (error) {
    console.error("Error en la operación:", error);
  }
});

function aplicarFiltros() {
  let maquinasFiltradas = maquinasData;

  // Filtrar por cédula
  const cedula = inputCedula.value.trim();
  if (cedula) {
    maquinasFiltradas = maquinasFiltradas.filter(
      (maquina) => maquina.cedula == cedula
    );
  }

  // Filtrar por nombre
  const nombre = inputNombre.value.trim().toLowerCase(); // Convertir a minúsculas para hacer la búsqueda insensible a mayúsculas
  if (nombre) {
    maquinasFiltradas = maquinasFiltradas.filter((maquina) =>
      maquina.nombre.toLowerCase().includes(nombre)
    );
  }

  // Filtrar por fecha
  const fecha = inputFecha.value.trim();
  if (fecha) {
    maquinasFiltradas = maquinasFiltradas.filter(
      (maquina) => maquina.fecha === fecha
    );
  }

  // Filtrar por garantía
  if (filtroGarantia.checked) {
    maquinasFiltradas = maquinasFiltradas.filter(
      (maquina) => maquina.garantia === "si"
    );
  }

  renderizarTabla(maquinasFiltradas);
}

// Filtrar por Cédula
function filtroCedula() {
  aplicarFiltros();
}

function filtroNombre() {
  aplicarFiltros();
}

// Filtrar por Fecha
function filtroFecha() {
  aplicarFiltros();
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
