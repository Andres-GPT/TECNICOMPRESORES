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
    const procedimientoInput = document.getElementById("descripcion_procedimiento");
    const costoRevisionInput = document.getElementById("costo_revision");
    const costoProcedimientoInput = document.getElementById("costo_procedimiento");
  
    const tecnicoSelect = document.getElementById("tecnico");
  
    // Hacer solo los campos editables
    tecnicoSelect.disabled = false;
    procedimientoInput.readOnly = false;
    costoRevisionInput.readOnly = false;
    costoProcedimientoInput.readOnly = false;
  
    // Resto de los campos no editables
    document.querySelectorAll("input, textarea").forEach((input) => {
      if (
        input.id !== "tecnico" &&
        input.id !== "costo_revision" &&
        input.id !== "costo_procedimiento" &&
        input.id !== "descripcion_procedimiento"
      ) {
        input.readOnly = true;
      }
    });
  
    let clienteOriginal = {};
    let maquinaOriginal = {};
    let procedimientoOriginal = {};
    let id_procedimiento;
  
    cedulaInput.value = cedula;
  
    try {
      const procedimientoResponse = await fetch(`${link}/procedimientos/completo/${id}`);
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
        costoProcedimientoInput.value = procedimientoOriginal.costo_procedimiento || "";
      }
  
      // Obtener lista de técnicos
      const tecnicosResponse = await fetch(`${link}/tecnicos`);
      const tecnicosData = await tecnicosResponse.json();
  
      if (!tecnicosData.error) {
        // Poner los datos en el select, excepto los de estado inactivo
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
  
    document.getElementById("form-register").addEventListener("submit", async (event) => {
      event.preventDefault();
  
      const tecnicoSeleccionado = tecnicoSelect.value; // Obtener cédula del técnico seleccionado
  
      if (!tecnicoSeleccionado) {
        alert("Debe seleccionar un técnico a cargo.");
        return;
      }
  
      const accion = event.submitter.id; // Identificar si fue "aceptar" o "cancelar"
  
      if (accion === "btn-aceptar") {
        const cambios = {
          id_tecnico: tecnicoSeleccionado !== procedimientoOriginal.id_tecnico ? tecnicoSeleccionado : null,
          descripcion: procedimientoInput.value !== procedimientoOriginal.descripcion ? procedimientoInput.value : null,
          costo_revision: costoRevisionInput.value !== procedimientoOriginal.costo_revision ? costoRevisionInput.value : null,
          costo_procedimiento: costoProcedimientoInput.value !== procedimientoOriginal.costo_procedimiento ? costoProcedimientoInput.value : null,
        };
  
        // Filtrar los cambios que no son null
        const cambiosFiltrados = Object.fromEntries(Object.entries(cambios).filter(([_, v]) => v !== null));
  
        if (Object.keys(cambiosFiltrados).length > 0) {
          await procesarProcedimiento(
            cambiosFiltrados
          );
        } else {
          // No hay cambios, regresar atrás
          window.history.back();
        }
      } else if (accion === "btn-cancelar") {
        // Si se cancela, simplemente regresar atrás
        window.history.back();
      }
    });
  
    async function procesarProcedimiento(
      cambios = {}
    ) {
      const procedimientoActualizado = {
        ...cambios,
      };
  
      try {
        await fetch(`${link}/procedimientos/${id_procedimiento}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(procedimientoActualizado),
        });
  
        mostrarModal("Procedimiento actualizado correctamente.", () => {
          window.location.href = "index.html";
        });
      } catch (error) {
        console.error("Error al actualizar los datos:", error);
        alert("Hubo un error al actualizar los datos.");
      }
    }
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