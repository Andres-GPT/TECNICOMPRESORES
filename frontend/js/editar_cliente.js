document.addEventListener("DOMContentLoaded", async () => {
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const cedula = hashParams.get("cedula");

  if (!cedula) {
    console.error("Faltan parámetros en la URL");
    mostrarModal("Error: No se especificó el cliente a editar", () => {
      window.location.href = "clientes.html";
    });
    return;
  }

  const cedulaInput = document.getElementById("cedula");
  const nombreInput = document.getElementById("nombre");
  const apellidoInput = document.getElementById("apellido");
  const telefonoInput = document.getElementById("telefono");
  const correoInput = document.getElementById("correo");
  const direccionInput = document.getElementById("direccion");

  let clienteOriginal = {};

  cedulaInput.value = cedula;
  cedulaInput.readOnly = true;

  // Validar nombre en tiempo real
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

  // Validar apellido en tiempo real
  apellidoInput.addEventListener("input", function () {
    if (this.value.length > 128) {
      this.value = this.value.slice(0, 128);
      document.getElementById("apellido-error").style.display = "block";
    } else if (
      this.value &&
      !this.value.match(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    ) {
      this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
      document.getElementById("apellido-error-letras").style.display = "block";
    } else {
      document.getElementById("apellido-error").style.display = "none";
      document.getElementById("apellido-error-letras").style.display = "none";
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

  // Validar dirección en tiempo real
  direccionInput.addEventListener("input", function () {
    if (this.value.length > 100) {
      this.value = this.value.slice(0, 100);
      document.getElementById("direccion-error").style.display = "block";
    } else {
      document.getElementById("direccion-error").style.display = "none";
    }
  });

  // Cargar datos del cliente
  try {
    const clienteResponse = await fetch(`${link}/clientes/${cedula}`);
    const clienteData = await clienteResponse.json();

    if (!clienteData.error) {
      clienteOriginal = { ...clienteData.cliente };
      nombreInput.value = clienteOriginal.nombre || "";
      apellidoInput.value = clienteOriginal.apellido || "";
      telefonoInput.value = clienteOriginal.telefono || "";
      correoInput.value = clienteOriginal.correo || "";
      direccionInput.value = clienteOriginal.direccion || "";
    } else {
      mostrarModal("Error al cargar los datos del cliente", () => {
        window.location.href = "clientes.html";
      });
    }
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    mostrarModal("Error de conexión al cargar el cliente", () => {
      window.location.href = "clientes.html";
    });
  }

  // Manejar submit del formulario
  document
    .getElementById("form-register")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const accion = event.submitter.id;

      if (accion === "btn-aceptar") {
        const datosActualizados = {
          nombre: nombreInput.value.trim(),
          apellido: apellidoInput.value.trim(),
          telefono: telefonoInput.value.trim(),
          correo: correoInput.value.trim(),
          direccion: direccionInput.value.trim(),
        };

        const respuesta = await actualizarCliente(cedula, datosActualizados);

        if (respuesta.error) {
          mostrarModal(
            respuesta.mensaje || "Hubo un error al actualizar el cliente."
          );
        } else {
          mostrarModal("Cliente actualizado exitosamente", () => {
            window.location.href = "clientes.html";
          });
        }
      }

      if (accion === "btn-eliminar") {
        mostrarModal(
          "¿Estás seguro de que deseas eliminar este cliente?",
          async () => {
            const respuesta = await eliminarCliente(cedula);

            if (respuesta.error) {
              mostrarModal(
                respuesta.mensaje || "No se pudo eliminar el cliente."
              );
            } else {
              mostrarModal("Cliente eliminado exitosamente", () => {
                window.location.href = "clientes.html";
              });
            }
          }
        );
      }
    });
});

async function actualizarCliente(cedula, data) {
  try {
    const response = await fetch(`${link}/clientes/${cedula}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el cliente");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    return { error: true, mensaje: "Error al actualizar el cliente" };
  }
}

async function eliminarCliente(cedula) {
  try {
    const response = await fetch(`${link}/clientes/${cedula}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el cliente");
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: true, mensaje: "Error al eliminar el cliente" };
  }
}

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
