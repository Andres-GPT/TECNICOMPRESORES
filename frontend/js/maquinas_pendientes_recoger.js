const inputCedula = document.getElementById("cedula");
const inputFecha = document.getElementById("fecha");

let maquinasData = []; // Se almacenarán los datos obtenidos de la API

async function mostrarUsuarios() {
  document.addEventListener("DOMContentLoaded", async () => {
    try {
      const response = await fetch(`${link}/maquinas/proceso/4`); // Reemplaza con tu endpoint real
      const data = await response.json();
      console.log(data);

      if (data.error) {
        console.error("Error obteniendo las máquinas:", data.mensaje);
        return;
      }

      // Guardamos los datos en la variable global
      maquinasData = data.maquinas.map((maquina) => ({
        id: maquina.id,
        cedula: maquina.cedula,
        nombre: maquina.nombre,
        apellido: maquina.apellido,
        descripcion: maquina.descripcion,
        procedimiento: maquina.procedimiento,
        fecha: maquina.fecha,
        estante: maquina.estante,
        nivel: maquina.nivel,
        notas: maquina.nota.nota,
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
          <th scope="row">${maquina.id}</th>
          <td>${maquina.cedula}</td>
          <td>${maquina.nombre}</td>
          <td>${maquina.apellido}</td>
          <td>${maquina.descripcion}</td>
          <td>${maquina.procedimiento}</td>
          <td class="estante-input">
            <input type="number" class="estante-input" data-id="${maquina.id}" value="${maquina.estante}">
          </td>
          <td class="nivel-input">
            <input type="number" class="nivel-input" data-id="${maquina.id}" value="${maquina.nivel}">
          </td>
          <td>${maquina.fecha}</td>
          <td>${maquina.notas}</td>
      </tr>
    `;
  });

  tbody.innerHTML = filas;

  // Agregar evento de clic a cada fila (excepto en los inputs)
  document.querySelectorAll(".table-custom tbody tr").forEach((row) => {
    row.addEventListener("click", function (event) {
      if (!event.target.classList.contains("estante-input") && !event.target.classList.contains("nivel-input")) {
        const id = this.getAttribute("data-id");
        const cedula = this.getAttribute("data-cedula");
        window.location.href = `confirmar_entrega.html?id=${id}&cedula=${cedula}`;
      }
    });
  });

  // Agregar eventos a los inputs para actualizar datos al cambiar
  document.querySelectorAll(".estante-input, .nivel-input").forEach((input) => {
    input.addEventListener("blur", async function () {
      const id = this.getAttribute("data-id");
      const campo = this.classList.contains("estante-input") ? "estante" : "nivel";
      const valor = this.value;

      await actualizarDato(id, campo, valor);
    });
  });
}

// Función para actualizar el dato en la API
async function actualizarDato(id, campo, valor) {
  try {
    const response = await fetch(`${link}/maquinas/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ [campo]: valor }),
    });

    if (!response.status === 200) {
      throw new Error("Error al actualizar el dato");
    }

    //alert(`Dato actualizado: ${campo} = ${valor} para ID ${id}`);
  } catch (error) {
    console.error("Error en la actualización:", error);
  }
}

// Filtrar por Cédula
function filtroCedula() {
  const cedula = inputCedula.value.trim();
  if (!cedula) {
    renderizarTabla(maquinasData); // Si está vacío, mostrar todos los datos
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
    renderizarTabla(maquinasData); // Si está vacío, mostrar todos los datos
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

// Inicializar la carga de datos
mostrarUsuarios();
