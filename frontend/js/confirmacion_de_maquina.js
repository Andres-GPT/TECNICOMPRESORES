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

  const tecnicoSelect = document.getElementById("tecnico");

  // Referencias al modal de estante y nivel
  const modalEstanteNivel = document.getElementById("modalEstanteNivel");
  const inputEstante = document.getElementById("inputEstante");
  const inputNivel = document.getElementById("inputNivel");
  const btnConfirmar = document.getElementById("btnConfirmar");
  const closeModal = document.querySelector("#modalEstanteNivel .close");

  // validar tamaño del nombre y que solo se introduzcan letras
  nombreInput.addEventListener("input", function () {
    if (this.value.length > 30) {
      this.value = this.value.slice(0, 30);
      document.getElementById("nombre-error").style.display = "block";
    } else if (!this.value.match(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)) {
      this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
      document.getElementById("nombre-error-letras").style.display = "block";
    } else {
      document.getElementById("nombre-error-letras").style.display = "none";
      document.getElementById("nombre-error").style.display = "none";
    }
  });

  // validar apellido en tiempo real
  apellidoInput.addEventListener("input", function () {
    if (this.value.length > 30) {
      this.value = this.value.slice(0, 30);
      document.getElementById("apellido-error").style.display = "block";
    } else if (!this.value.match(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)) {
      this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
      document.getElementById("apellido-error-letras").style.display = "block";
    } else {
      document.getElementById("apellido-error-letras").style.display = "none";
      document.getElementById("apellido-error").style.display = "none";
    }
  });

  // Validar teléfono en tiempo real
  telefonoInput.addEventListener("input", function () {
    if (this.value.length > 10) {
      this.value = this.value.slice(0, 10);
      document.getElementById("telefono-error").style.display = "block";
    } else {
      document.getElementById("telefono-error").style.display = "none";
    }
  });

  // Validar correo en tiempo real
  correoInput.addEventListener("input", function () {
    const correo = this.value.trim();
    if (correo === "") {
      // Si el campo está vacío, no mostrar error
      document.getElementById("correo-error").style.display = "none";
    } else if (!correo.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      // Si el campo no está vacío y no cumple con el formato, mostrar error
      document.getElementById("correo-error").style.display = "block";
    } else {
      // Si el campo está vacío o tiene un formato válido, ocultar error
      document.getElementById("correo-error").style.display = "none";
    }
  });

  // Validar dirección en tiempo real
  direccionInput.addEventListener("input", function () {
    if (this.value.length > 100) {
      this.value = this.value.slice(0, 100);
      document.getElementById("direccion-error").style.display = "block";
    } else {
      document.getElementById("direccion-error").style.display = "none";
    }
  });

  // Validar descripción en tiempo real
  descripcionInput.addEventListener("input", function () {
    if (this.value.length > 255) {
      this.value = this.value.slice(0, 255);
      document.getElementById("descripcion-error").style.display = "block";
    } else {
      document.getElementById("descripcion-error").style.display = "none";
    }
  });

  // Validar observaciones en tiempo real
  observacionesInput.addEventListener("input", function () {
    if (this.value.length > 255) {
      this.value = this.value.slice(0, 255);
      document.getElementById("observaciones-error").style.display = "block";
    } else {
      document.getElementById("observaciones-error").style.display = "none";
    }
  });

  // Validar descripción del procedimiento en tiempo real
  procedimientoInput.addEventListener("input", function () {
    if (this.value.length > 255) {
      this.value = this.value.slice(0, 255);
      document.getElementById("descripcion_procedimiento-error").style.display =
        "block";
    } else {
      document.getElementById("descripcion_procedimiento-error").style.display =
        "none";
    }
  });

  // Validar costo de revisión en tiempo real
  costoRevisionInput.addEventListener("input", function () {
    // Eliminar cualquier carácter no numérico (excepto números)
    let value = this.value.replace(/\D/g, "");

    // Limitar la cantidad de dígitos a 10 (sin contar los puntos de formato)
    if (value.length > 10) {
      value = value.slice(0, 10);
      document.getElementById("costo_revision-error").style.display = "block";
    } else {
      document.getElementById("costo_revision-error").style.display = "none";
    }

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
    // Eliminar cualquier carácter no numérico (excepto números)
    let value = this.value.replace(/\D/g, "");

    // Limitar la cantidad de dígitos a 10 (sin contar los puntos de formato)
    if (value.length > 10) {
      value = value.slice(0, 10);
      document.getElementById("costo_procedimiento-error").style.display =
        "block";
    } else {
      document.getElementById("costo_procedimiento-error").style.display =
        "none";
    }

    // Si el campo no tiene valor, evitar que muestre un "0"
    if (value === "") {
      this.value = "";
      return;
    }

    // Aplicar formato con separadores de miles
    this.value = new Intl.NumberFormat("es-ES").format(Number(value));
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

    // Obtener lista de técnicos
    const tecnicosResponse = await fetch(`${link}/tecnicos`);
    const tecnicosData = await tecnicosResponse.json();

    if (!tecnicosData.error) {
      // poner los datos en el select, excepto los de estado inactivo
      tecnicosData.tecnicos
        .filter((tecnico) => tecnico.estado === "activo")
        .forEach((tecnico) => {
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

  // Función para eliminar el formato de separación de miles
  function eliminarFormato(valorFormateado) {
    return valorFormateado.replace(/\./g, "");
  }

  document
    .getElementById("form-register")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      // Limpiar los valores de los costos antes de enviar el formulario
      const costoRevisionSinFormato = eliminarFormato(costoRevisionInput.value);
      const costoProcedimientoSinFormato = eliminarFormato(
        costoProcedimientoInput.value
      );

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
          0,
          costoProcedimientoSinFormato,
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
    costoRevision,
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
      costo_revision: costoRevision,
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
          window.location.href = "maquinas_pendientes_revision.html";
        });
      } else {
        mostrarModal("Procedimiento aprobado correctamente.", () => {
          window.location.href = "maquinas_pendientes_revision.html";
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

    // Limpiar los valores de los costos antes de enviar el formulario
    const costoRevisionSinFormato = eliminarFormato(costoRevisionInput.value);

    const tecnicoSeleccionado = tecnicoSelect.value; // Obtener cédula del técnico seleccionado

    if (!tecnicoSeleccionado) {
      alert("Debe seleccionar un técnico a cargo.");
      return;
    }

    modalEstanteNivel.style.display = "none";
    await procesarProcedimiento(
      "rechazado",
      "pendiente por recoger",
      costoRevisionSinFormato,
      0,
      tecnicoSeleccionado,
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
