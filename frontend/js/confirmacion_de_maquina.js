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

  // Validar teléfono en tiempo real
  telefonoInput.addEventListener("input", function () {
    if (this.value.length > 10) {
      this.value = this.value.slice(0, 10);
      document.getElementById("telefono-error").style.display = "block";
    } else {
      document.getElementById("telefono-error").style.display = "none";
    }
  });

  cedulaInput.value = cedula;
  cedulaInput.readOnly = true;

  let clienteOriginal = {};
  let maquinaOriginal = {};
  let procedimientoOriginal = {};
  let id_procedimiento;

  try {
    const procedimientoResponse = await fetch(
      `${link}/procedimientos/completo/${id}`
    );
    const procedimientoData = await procedimientoResponse.json();
    id_procedimiento = procedimientoData.procedimiento.id;

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
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }

  document
    .getElementById("form-register")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const accion = event.submitter.id; // Identificar si fue "aceptar" o "cancelar"
      let estadoProcedimiento = "";
      let estadoMaquina = "";
      let costo_procedimiento = 0;

      if (accion === "btn-aceptar") {
        estadoProcedimiento = "aceptado";
        estadoMaquina = "en proceso";
        costo_procedimiento = costoProcedimientoInput.value;
      } else if (accion === "btn-cancelar") {
        estadoProcedimiento = "rechazado";
        estadoMaquina = "pendiente por recoger";
        costo_procedimiento = 0;
      }

      // Verificar cambios en cliente, máquina y procedimiento
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
      const procedimientoActualizado = {
        descripcion: procedimientoInput.value,
        costo_revision: costoRevisionInput.value,
        costo_procedimiento: costo_procedimiento,
        estado: estadoProcedimiento,
      };

      const cambiosCliente =
        JSON.stringify(clienteActualizado) !== JSON.stringify(clienteOriginal);

      try {
        await fetch(`${link}/procedimientos/${id_procedimiento}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(procedimientoActualizado),
        });
        await fetch(`${link}/maquinas/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(maquinaActualizada),
        });

        if (cambiosCliente) {
          await fetch(`${link}/clientes/${cedula}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(clienteActualizado),
          });
        }
        mostrarModal("Procedimineto confirmado correctamente.", () => {
          window.location.href = "index.html";
        });
      } catch (error) {
        console.error("Error al actualizar los datos:", error);
        alert("Hubo un error al actualizar los datos.");
      }
    });
});

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

