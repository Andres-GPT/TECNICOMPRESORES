document.addEventListener("DOMContentLoaded", async () => {
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const id = hashParams.get("id");
  const cedula = hashParams.get("cedula");

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
  const notasInput = document.getElementById("notas");

  // validar la nota en tiempo real
  notasInput.addEventListener("input", function () {
    if (this.value.length > 255) {
      this.value = this.value.slice(0, 255);
      document.getElementById("notas-error").style.display = "block";
    } else {
      document.getElementById("notas-error").style.display = "none";
    }
  });

  // Validar costo de revisión en tiempo real
  costoRevisionInput.addEventListener("input", function () {
    let value = this.value;

    // Si el campo no tiene valor, evitar que muestre un "0"
    if (value === "") {
      this.value = "";
      return;
    }

    // Aplicar formato con separadores de miles
    this.value = new Intl.NumberFormat("es-ES").format(Number(value));
  });

  // Validar costo del procedimiento en tiempo real
  costoProcedimientoInput.addEventListener("input", function () {
    let value = this.value;

    // Si el campo no tiene valor, evitar que muestre un "0"
    if (value === "") {
      this.value = "";
      return;
    }

    // Aplicar formato con separadores de miles
    this.value = new Intl.NumberFormat("es-ES").format(Number(value));
  });

  // Hacer todos los inputs readonly, excepto el de notas
  document.querySelectorAll("input, textarea").forEach((input) => {
    if (input.id !== "notas") input.readOnly = true;
  });
  cedulaInput.value = cedula;
  cedulaInput.readOnly = true;

  let clienteOriginal = {};
  let maquinaOriginal = {};
  let procedimientoOriginal = {};
  let id_procedimiento;
  let notaExistente = null;

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

      // Formatear los valores de costos al cargar los datos
      costoRevisionInput.value = procedimientoOriginal.costo_revision
        ? new Intl.NumberFormat("es-ES").format(
            parseFloat(procedimientoOriginal.costo_revision)
          )
        : "";

      costoProcedimientoInput.value = procedimientoOriginal.costo_procedimiento
        ? new Intl.NumberFormat("es-ES").format(
            parseFloat(procedimientoOriginal.costo_procedimiento)
          )
        : "";
    }

    // Obtener la nota existente
    const notasResponse = await fetch(`${link}/notas/${id}`);
    const notasData = await notasResponse.json();
    if (notasData && notasData.nota) {
      notasInput.value = notasData.nota.nota;
      notaExistente = notasData.nota;
    } else {
      notasInput.value = "";
    }
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }

  document
    .getElementById("form-register")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const accion = event.submitter.id; // Identificar si fue "aceptar" o "cancelar"
      let estadoMaquina = "";

      if (accion === "btn-entregar") {
        estadoMaquina = "terminado";
      } else if (accion === "btn-noEntregar") {
        estadoMaquina = "pendiente por recoger";
      }

      const maquinaActualizada = { estado: estadoMaquina };

      try {
        await fetch(`${link}/maquinas/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(maquinaActualizada),
        });

        const nuevaNota = notasInput.value.trim();

        if (accion === "btn-noEntregar") {
          if (notaExistente) {
            // Actualizar la nota existente con PUT
            await fetch(`${link}/notas/${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ nota: nuevaNota }),
            });
          } else {
            // Crear una nueva nota con POST
            await fetch(`${link}/notas`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id_maquina: id, nota: nuevaNota }),
            });
          }
        }
        mostrarModal("Actualización realizada correctamente.", () => {
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
