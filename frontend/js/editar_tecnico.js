document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const cedula = params.get("cedula"); // Cédula del usuario

  if (!cedula) {
    console.error("Faltan parámetros en la URL");
    return;
  }

  const cedulaInput = document.getElementById("cedula");
  const nombreInput = document.getElementById("nombre");
  const apellidoInput = document.getElementById("apellido");
  const telefonoInput = document.getElementById("telefono");

  let tecnicoOriginal = {};

  cedulaInput.value = cedula;
  cedulaInput.readOnly = true;

  try {
    const tecnicoResponse = await fetch(`${link}/tecnicos/${cedula}`);
    const tecnicoData = await tecnicoResponse.json();

    if (!tecnicoData.error) {
      tecnicoOriginal = { ...tecnicoData.tecnico };
      nombreInput.value = tecnicoOriginal.nombre || "";
      apellidoInput.value = tecnicoOriginal.apellido || "";
      telefonoInput.value = tecnicoOriginal.telefono || "";
    }
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }

  document
    .getElementById("form-register")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const accion = event.submitter.id; // Identificar si fue "eliminar" o "aceptar"

      if (accion === "btn-aceptar") {
        const datosActualizados = {
          nombre: nombreInput.value.trim(),
          apellido: apellidoInput.value.trim(),
          telefono: telefonoInput.value.trim(),
        };

        const respuesta = await actualizarTecnico(cedula, datosActualizados);

        if (respuesta.error) {
          alert("Hubo un error al actualizar el técnico.");
        } else {
          mostrarModal("Técnico actualizado exitosamente", () => {
            window.location.href = "tecnicos.html"; // Redirigir a la lista de técnicos
          });
        }
      }

      if (accion === "btn-cancelar") {
        mostrarModal(
          "¿Estás seguro de que deseas eliminar este técnico?",
          async () => {
            const respuesta = await eliminarTecnico(cedula);

            if (respuesta.error) {
              alert("No se pudo eliminar el técnico.");
            } else {
              mostrarModal("Técnico eliminado exitosamente", () => {
                window.location.href = "tecnicos.html"; // Redirigir a la lista
              });
            }
          }
        );
      }
    });
});

async function actualizarTecnico(cedula, data) {
  try {
    const response = await fetch(`${link}/tecnicos/${cedula}`, {
      method: "PUT", // Usar PUT para actualizar
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el técnico");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    return { error: true, mensaje: "Error al actualizar el técnico" };
  }
}

async function eliminarTecnico(cedula) {
  try {
    const response = await fetch(`${link}/tecnicos/${cedula}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el técnico");
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: true, mensaje: "Error al eliminar el técnico" };
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
