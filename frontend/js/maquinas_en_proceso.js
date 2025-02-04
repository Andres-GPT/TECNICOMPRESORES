const inputCedula = document.getElementById("cedula");
const inputFecha = document.getElementById("fecha");

let maquinasData = [];
let idMaquinaSeleccionada = null; // Se almacenará el ID de la máquina seleccionada

// Elementos del modal
const modal = document.getElementById("modalEstanteNivel");
const inputEstante = document.getElementById("inputEstante");
const inputNivel = document.getElementById("inputNivel");
const btnConfirmar = document.getElementById("btnConfirmar");
const closeModal = document.querySelector(".close");

// Mostrar datos al cargar la página
document.addEventListener("DOMContentLoaded", async () => {
  await mostrarUsuarios();
});

// Obtener datos de la API
async function mostrarUsuarios() {
  try {
    const response = await fetch(`${link}/maquinas/proceso/3`);
    const data = await response.json();

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
    }));

    renderizarTabla(maquinasData);
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }
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
    filas += `
      <tr data-id="${maquina.id}" data-cedula="${maquina.cedula}">
          <th scope="row">${maquina.id}</th>
          <td>${maquina.cedula}</td>
          <td>${maquina.nombre}</td>
          <td>${maquina.apellido}</td>
          <td>${maquina.descripcion}</td>
          <td>${maquina.procedimiento}</td>
          <td>${maquina.fecha}</td>
          <td>
              <button class="btn-accion" data-id="${maquina.id}">Confirmar</button>
          </td>
      </tr>
    `;
  });

  tbody.innerHTML = filas;

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
        body: JSON.stringify({ estado: "pendiente por recoger", estante, nivel }),
      }
    );

    if (!responsePut.ok) throw new Error("Error al actualizar la máquina.");

    console.log(`Máquina ${idMaquinaSeleccionada} actualizada correctamente.`);

    // 2. Registrar el recibo
    const responsePost = await fetch(`${link}/recibos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_maquina: idMaquinaSeleccionada }),
    });

    if (!responsePost.ok) throw new Error("Error al registrar el recibo.");

    console.log(
      `Recibo para la máquina ${idMaquinaSeleccionada} registrado correctamente.`
    );

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

// Filtrar por Cédula
function filtroCedula() {
  const cedula = inputCedula.value.trim();
  if (!cedula) {
    renderizarTabla(maquinasData);
    return;
  }
  const maquinasFiltradas = maquinasData.filter(
    (maquina) => maquina.cedula == cedula
  );
  renderizarTabla(maquinasFiltradas);
}

// Filtrar por Fecha
function filtroFecha() {
  const fecha = inputFecha.value.trim();
  if (!fecha) {
    renderizarTabla(maquinasData);
    return;
  }
  const maquinasFiltradas = maquinasData.filter(
    (maquina) => maquina.fecha === fecha
  );
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
