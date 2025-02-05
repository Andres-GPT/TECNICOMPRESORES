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

  // Bloquear la edición de la cédula
  cedulaInput.value = cedula;
  cedulaInput.readOnly = true;

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
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }

  document
    .getElementById("form-register")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      let clienteModificado = false;
      let maquinaModificada = false;

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
            costo_revision: costoRevisionInput.value,
            costo_procedimiento: costoProcedimientoInput.value,
          }),
        });

        alert("Datos actualizados y procedimiento registrado correctamente.");
        window.location.href = "index.html"; // Redirigir a inicio
      } catch (error) {
        console.error("Error al actualizar los datos:", error);
        alert("Hubo un error al actualizar los datos.");
      }
    });
});
