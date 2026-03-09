const inputCedula = document.getElementById("cedula");
const inputFecha = document.getElementById("fecha");
const inputNombre = document.getElementById("nombre");

let maquinasData = []; // Se almacenarán los datos obtenidos de la API

async function mostrarUsuarios() {
  document.addEventListener("DOMContentLoaded", async () => {
    try {
      const response = await fetch(`${link}/maquinas/proceso/5`); // Reemplaza con tu endpoint real
      const data = await response.json();
      console.log(data.maquinas);

      if (data.error) {
        console.error("Error obteniendo las máquinas:", data.mensaje);
        return;
      }

      // Guardamos los datos en la variable global
      maquinasData = data.maquinas.map((maquina) => ({
        id: maquina.id,
        id_procedimiento: maquina.id_procedimiento,
        cedula: maquina.cedula,
        nombre: maquina.nombre,

        descripcion: maquina.descripcion,
        procedimiento: maquina.procedimiento,
        fecha: maquina.fecha,
        estado_cliente: maquina.estado_cliente,
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

  // Ordenar los datos por fecha (de más reciente a más antigua)
  const datosOrdenados = data.sort((a, b) => {
    const fechaA = new Date(a.fecha);
    const fechaB = new Date(b.fecha);
    return fechaB - fechaA; // Orden descendente (más reciente primero)
  });

  // Si prefieres ordenar por ID de máquina (de mayor a menor), usa esto:
  // const datosOrdenados = data.sort((a, b) => b.id - a.id);

  let filas = "";

  datosOrdenados.forEach((maquina) => {
    filas += `
  <tr data-id="${maquina.id}" data-cedula="${maquina.cedula}">
      <td>${maquina.cedula}</td>
      <td>${maquina.nombre}</td>

      <td>${maquina.descripcion}</td>
      <td>${maquina.procedimiento}</td>
      <td>${maquina.fecha}</td>
      <td class="devolver">
          ${
            maquina.estado_cliente === "aceptado"
              ? `<button class="garantia-btn" onclick="activarGarantia(this)" maquina-id="${maquina.id}" procedimiento-id="${maquina.id_procedimiento}">Garantía</button>`
              : ""
          }
          <button class="devolver-btn" onclick="devolverMaquina(this)" data-id="${
            maquina.id
          }">Devolver</button>
      </td>
  </tr>
`;
  });

  tbody.innerHTML = filas;

  // Agregar evento de clic a cada fila
  document.querySelectorAll(".table-custom tbody tr").forEach((row) => {
    row.addEventListener("click", function (event) {
      if (!event.target.closest("button")) {
        const id = this.getAttribute("data-id");
        const procedimientoId = this.getAttribute("procedimiento-id");
        const maquinaId = this.getAttribute("maquina-id");
        const cedula = this.getAttribute("data-cedula");
        window.location.href = `generar_recibo_final.html#id=${id}&cedula=${cedula}`;
      }
    });
  });
}

// Función para devolver la máquina
function devolverMaquina(btn) {
  showConfirmDialog(
      "Devolver Máquina", 
      "¿Está seguro de que desea devolver esta máquina?", 
      async () => {
          const id = btn.getAttribute("data-id");
          try {
            const response = await fetch(`${link}/maquinas/${id}`, {
                method: "PUT",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({ estado: "pendiente por recoger" }),
            });

            if (!response.ok) { // Corrected check (response.ok instead of !response.status === 200)
                throw new Error("Error al devolver la máquina");
            }

            mostrarModal("Máquina devuelta con éxito.", () => {
                 showToast("Redirigiendo...", "success");
                 setTimeout(() => {
                     window.location.href = "index.html";
                 }, 1500);
            });
          } catch (error) {
            console.error(error);
            showToast(error.message, "error");
          }
      }
  );
}

// Función para activar la garantía
// Función para activar la garantía
async function activarGarantia(btn) {
    showConfirmDialog(
        "Activar Garantía", 
        "¿Está seguro de que desea activar la garantía para esta máquina?", 
        async () => {
            const maquinaId = btn.getAttribute("maquina-id");
            const procedimientoId = btn.getAttribute("procedimiento-id");
            console.log(maquinaId, procedimientoId);

            try {
                // Actualizar procedimientos
                const responseProc = await fetch(
                `${link}/procedimientos/${procedimientoId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ garantia: "si" }),
                }
                );

                if (!responseProc.ok) throw new Error("Error en procedimientos");

                // Actualizar máquinas
                const responseMaq = await fetch(`${link}/maquinas/${maquinaId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ estado: "en proceso" }),
                });

                if (!responseMaq.ok) throw new Error("Error en máquinas");

                mostrarModal("Garantía activada. Máquina en proceso.", () => {
                    showToast("Recargando...", "success");
                    setTimeout(() => {
                         window.location.reload(); 
                    }, 1500);
                });
            } catch (error) {
                console.error(error);
                mostrarModal("Error al activar garantía: " + error.message);
            }
        }
    );
}

function mostrarModal(mensaje, callback) {
  const modal = document.getElementById("modal-confirmacion");
  const modalMensaje = document.getElementById("modal-mensaje");
  const btnCerrar = document.getElementById("modal-cerrar");

  modal.classList.add('show');
  modalMensaje.textContent = mensaje;
  modal.style.display = "flex";

  btnCerrar.onclick = function () {
    modal.style.display = "none";
    modal.classList.remove('show');
    if (callback) callback();
  };
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
