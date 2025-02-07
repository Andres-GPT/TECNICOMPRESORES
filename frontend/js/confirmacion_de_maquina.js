document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id"); // ID de la máquina
  const cedula = params.get("cedula"); // Cédula del usuario

  if (!id || !cedula) {
    console.error("Faltan parámetros en la URL");
    return;
  }

  const cedulaInput = document.getElementById("cedula");
  const nombreInput = document.getElementById("nombre");
  const apellidoInput = document.getElementById("apellido");
  const telefonoInput = document.getElementById("telefono");
  const correoInput = document.getElementById("correo");
  const direccionInput = document.getElementById("direccion");

  const descripcionInput = document.getElementById("descripcion");
  const observacionesInput = document.getElementById("observaciones");
  const procedimientoInput = document.getElementById(
    "descripcion_procedimiento"
  );
  const costoRevisionInput = document.getElementById("costo_revision");
  const costoProcedimientoInput = document.getElementById(
    "costo_procedimiento"
  );

  const tecnicoSelect = document.getElementById("tecnico");

  // Referencias al modal de estante y nivel
  const modalEstanteNivel = document.getElementById("modalEstanteNivel");
  const inputEstante = document.getElementById("inputEstante");
  const inputNivel = document.getElementById("inputNivel");
  const btnConfirmar = document.getElementById("btnConfirmar");
  const closeModal = document.querySelector("#modalEstanteNivel .close");

  let clienteOriginal = {};
  let maquinaOriginal = {};
  let procedimientoOriginal = {};
  let id_procedimiento;

  cedulaInput.value = cedula;
  cedulaInput.readOnly = true;

  try {
    const procedimientoResponse = await fetch(
      `${link}/procedimientos/completo/${id}`
    );
    const procedimientoData = await procedimientoResponse.json();
    id_procedimiento = procedimientoData.procedimiento.id;
    id_tecnico = procedimientoData.procedimiento.id_tecnico;

    if (!procedimientoData.error) {
      clienteOriginal = {
        ...procedimientoData.procedimiento.maquina.cliente_maquina,
      };
      nombreInput.value = clienteOriginal.nombre || "";
      apellidoInput.value = clienteOriginal.apellido || "";
      telefonoInput.value = clienteOriginal.telefono || "";
      correoInput.value = clienteOriginal.correo || "";
      direccionInput.value = clienteOriginal.direccion || "";
    }

    if (!procedimientoData.error) {
      maquinaOriginal = { ...procedimientoData.procedimiento.maquina };
      delete maquinaOriginal.cliente_maquina;
      descripcionInput.value = maquinaOriginal.descripcion || "";
      observacionesInput.value = maquinaOriginal.observacion || "";
    }

    if (!procedimientoData.error) {
      procedimientoOriginal = { ...procedimientoData.procedimiento };
      delete procedimientoOriginal.maquina;
      procedimientoInput.value = procedimientoOriginal.descripcion || "";
      costoRevisionInput.value = procedimientoOriginal.costo_revision || "";
      costoProcedimientoInput.value =
        procedimientoOriginal.costo_procedimiento || "";
    }

    // Obtener lista de técnicos
    const tecnicosResponse = await fetch(`${link}/tecnicos`);
    const tecnicosData = await tecnicosResponse.json();

    if (!tecnicosData.error) {
      tecnicosData.tecnicos.forEach((tecnico) => {
        const option = document.createElement("option");
        option.value = tecnico.cedula;
        option.textContent = `${tecnico.cedula} - ${tecnico.nombre}`;

        // Agregar opción al select
        tecnicoSelect.appendChild(option);

        // Si el técnico corresponde al procedimiento, seleccionarlo
        if (procedimientoOriginal.id_tecnico === tecnico.cedula) {
          option.selected = true;
        }
      });
    } else {
      console.error("Error obteniendo técnicos:", tecnicosData.mensaje);
    }
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }

  document
    .getElementById("form-register")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const tecnicoSeleccionado = tecnicoSelect.value; // Obtener cédula del técnico seleccionado

      if (!tecnicoSeleccionado) {
        alert("Debe seleccionar un técnico a cargo.");
        return;
      }

      const accion = event.submitter.id; // Identificar si fue "aceptar" o "cancelar"

      if (accion === "btn-aceptar") {
        await procesarProcedimiento(
          "aceptado",
          "en proceso",
          costoProcedimientoInput.value,
          tecnicoSeleccionado
        );
      } else if (accion === "btn-cancelar") {
        // Abre el modal para ingresar estante y nivel
        modalEstanteNivel.style.display = "block";
      }
    });

  async function procesarProcedimiento(
    estadoProcedimiento,
    estadoMaquina,
    costoProcedimiento,
    tecnicoSeleccionado,
    estante = 0,
    nivel = 0
  ) {
    const clienteActualizado = {
      nombre: nombreInput.value,
      apellido: apellidoInput.value,
      telefono: telefonoInput.value,
      correo: correoInput.value,
      direccion: direccionInput.value,
    };
    const maquinaActualizada = {
      descripcion: descripcionInput.value,
      observaciones: observacionesInput.value,
      estado: estadoMaquina,
    };
    console.log("datos a actualizar para la máquina:", maquinaActualizada);
    const procedimientoActualizado = {
      descripcion: procedimientoInput.value,
      costo_revision: costoRevisionInput.value,
      costo_procedimiento: costoProcedimiento,
      estado: estadoProcedimiento,
      id_tecnico: tecnicoSeleccionado,
    };
    const cambiosCliente =
      JSON.stringify(clienteActualizado) !== JSON.stringify(clienteOriginal);

    try {
      await fetch(`${link}/procedimientos/${id_procedimiento}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(procedimientoActualizado),
      });
      const response = await fetch(`${link}/maquinas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...maquinaActualizada, estante, nivel }),
      });
      const data = await response.json();
      console.log("Respuesta del servidor (PUT máquina):", data);
      if (cambiosCliente) {
        await fetch(`${link}/clientes/${cedula}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(clienteActualizado),
        });
      }

      if (estadoProcedimiento === "rechazado") {
        await fetch(`${link}/recibos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_maquina: id }),
        });
      }

      if (estadoProcedimiento === "rechazado") {
        mostrarModal("Procedimiento rechazado correctamente.", () => {
          window.location.href = "index.html";
        });
      } else {
        mostrarModal("Procedimiento aprobado correctamente.", () => {
          window.location.href = "index.html";
        });
      }
    } catch (error) {
      console.error("Error al actualizar los datos:", error);
      alert("Hubo un error al actualizar los datos.");
    }
  }

  // Confirmación desde el modal de estante y nivel
  btnConfirmar.addEventListener("click", async () => {
    const estante = inputEstante.value.trim();
    const nivel = inputNivel.value.trim();

    if (!estante || !nivel) {
      alert("Por favor ingrese estante y nivel.");
      return;
    }

    modalEstanteNivel.style.display = "none";
    await procesarProcedimiento(
      "rechazado",
      "pendiente por recoger",
      0,
      estante,
      nivel
    );
  });

  closeModal.addEventListener("click", () => {
    modalEstanteNivel.style.display = "none";
  });
});

// Función para mostrar el modal de confirmación
function mostrarModal(mensaje, callback) {
  const modal = document.getElementById("modal-confirmacion");
  const modalMensaje = document.getElementById("modal-mensaje");
  const btnCerrar = document.getElementById("modal-cerrar");

  modalMensaje.textContent = mensaje;
  modal.style.display = "flex";

  btnCerrar.onclick = function () {
    modal.style.display = "none";
    if (callback) callback();
  };
}
