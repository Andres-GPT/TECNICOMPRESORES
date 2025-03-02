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

  // Evento para el botón "Atrás"
  document
    .getElementById("btn-cancelar")
    .addEventListener("click", function (event) {
      event.preventDefault();
      window.location.href = "maquinas_pendientes_revision.html";
    });

  // Bloquear la edición de la cédula
  cedulaInput.value = cedula;
  cedulaInput.readOnly = true;

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
    if (this.value.length > 15) {
      this.value = this.value.slice(0, 15);
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

  let clienteOriginal = {};
  let maquinaOriginal = {};

  try {
    // Obtener datos del cliente
    const clienteResponse = await fetch(`${link}/clientes/${cedula}`);
    const clienteData = await clienteResponse.json();

    if (!clienteData.error) {
      clienteOriginal = { ...clienteData.cliente }; // Guardar valores originales
      nombreInput.value = clienteData.cliente.nombre || "";
      apellidoInput.value = clienteData.cliente.apellido || "";
      telefonoInput.value = clienteData.cliente.telefono || "";
      correoInput.value = clienteData.cliente.correo || "";
      direccionInput.value = clienteData.cliente.direccion || "";
    } else {
      console.error("Error obteniendo el cliente:", clienteData.mensaje);
    }

    // Obtener datos de la máquina
    const maquinaResponse = await fetch(`${link}/maquinas/${id}`);
    const maquinaData = await maquinaResponse.json();

    if (!maquinaData.error) {
      maquinaOriginal = { ...maquinaData.maquina }; // Guardar valores originales
      descripcionInput.value = maquinaData.maquina.descripcion || "";
      observacionesInput.value = maquinaData.maquina.observacion || "";
    } else {
      console.error("Error obteniendo la máquina:", maquinaData.mensaje);
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

      let clienteModificado = false;
      let maquinaModificada = false;

      const tecnicoSeleccionado = tecnicoSelect.value; // Obtener cédula del técnico seleccionado

      if (!tecnicoSeleccionado) {
        alert("Debe seleccionar un técnico a cargo.");
        return;
      }

      // Datos del cliente a actualizar
      const clienteActualizado = {
        nombre: nombreInput.value,
        apellido: apellidoInput.value,
        telefono: telefonoInput.value,
        correo: correoInput.value,
        direccion: direccionInput.value,
      };

      // Verificar si hay cambios en los datos del cliente
      for (let key in clienteActualizado) {
        if (clienteActualizado[key] !== clienteOriginal[key]) {
          clienteModificado = true;
          break;
        }
      }

      // Datos de la máquina a actualizar (el estado siempre cambia)
      const maquinaActualizada = {
        descripcion: descripcionInput.value,
        observaciones: observacionesInput.value,
        estado: "en espera de aprobación", // Estado siempre se actualiza
      };

      // Verificar si hay cambios en los datos de la máquina (sin incluir el estado)
      for (let key in maquinaActualizada) {
        if (
          key !== "estado" &&
          maquinaActualizada[key] !== maquinaOriginal[key]
        ) {
          maquinaModificada = true;
          break;
        }
      }

      try {
        if (clienteModificado) {
          await fetch(`${link}/clientes/${cedula}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(clienteActualizado),
          });
        }

        if (
          maquinaModificada ||
          maquinaOriginal.estado !== "en espera de aprobación"
        ) {
          await fetch(`${link}/maquinas/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(maquinaActualizada),
          });
        }

        // Registrar procedimiento (POST)
        await fetch(`${link}/procedimientos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_maquina: id,
            descripcion: procedimientoInput.value,
            costo_revision: costoRevisionSinFormato, // Enviar el valor sin formato
            costo_procedimiento: costoProcedimientoSinFormato, // Enviar el valor sin formato
            id_tecnico: tecnicoSeleccionado,
          }),
        });

        mostrarModal(
          "Datos actualizados y procedimiento registrado correctamente.",
          () => {
            window.location.href = "index.html";
          }
        );
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
