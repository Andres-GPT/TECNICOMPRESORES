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

  // Hacer todos los inputs readonly, excepto el de notas
  document.querySelectorAll("input, textarea").forEach((input) => {
    input.readOnly = true;
  });
  cedulaInput.value = cedula;
  cedulaInput.readOnly = true;

  let clienteOriginal = {};
  let maquinaOriginal = {};
  let procedimientoOriginal = {};
  let tecnico = {};
  let id_procedimiento;
  let notaExistente = null;

  try {
    const procedimientoResponse = await fetch(
      `${link}/procedimientos/completo/${id}`
    );
    const procedimientoData = await procedimientoResponse.json();
    id_procedimiento = procedimientoData.procedimiento.id;
    const id_tecnico = procedimientoData.procedimiento.id_tecnico;

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

    // Obtener lista de técnicos
    const tecnicoResponse = await fetch(`${link}/tecnicos/${id_tecnico}`);
    const tecnicoData = await tecnicoResponse.json();

    if (!tecnicoData.error) {
      tecnico = { ...tecnicoData.tecnico };
    } else {
      console.error("Error obteniendo técnico:", tecnicoData.mensaje);
    }
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }

  document
    .getElementById("form-register")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const accion = event.submitter.id; // Identificar si fue "aceptar" o "cancelar"

      if (accion === "btn-entregar") {
        // formetear la fecha de entrada
        const fechaEntradaFormateada =
          maquinaOriginal.fecha_entrada.split("T")[0];
        const fechaRevisionFormateada =
          procedimientoOriginal.fecha_revision.split("T")[0];

        // Formatear los valores de costos

        const costoRevisionFormateado = new Intl.NumberFormat("es-ES").format(
          parseFloat(procedimientoOriginal.costo_revision)
        );

        const costoProcedimientoFormateado = new Intl.NumberFormat(
          "es-ES"
        ).format(parseFloat(procedimientoOriginal.costo_procedimiento));

        const reciboFinalDatos = {
          cedula: cedula,
          nombre: clienteOriginal.nombre,
          apellido: clienteOriginal.apellido,
          telefono: clienteOriginal.telefono,
          correo: clienteOriginal.correo,
          direccion: clienteOriginal.direccion,
          descripcion: maquinaOriginal.descripcion,
          observaciones: maquinaOriginal.observacion,
          fecha: fechaEntradaFormateada,
          procedimiento: procedimientoOriginal.descripcion,
          estado: procedimientoOriginal.estado_cliente,
          cedula_tecnico: tecnico.cedula,
          nombre_tecnico: tecnico.nombre,
          apellido_tecnico: tecnico.apellido,
          telefono_tecnico: tecnico.telefono,
          fecha_revision: fechaRevisionFormateada,
          costo_revision: costoRevisionFormateado,
          costo_procedimiento: costoProcedimientoFormateado,
          notas: notasInput.value,
        };
        sessionStorage.setItem(
          "reciboFinalDatos",
          JSON.stringify(reciboFinalDatos)
        );
        location.href = "recibo_final.html";
      } else if (accion === "btn-noEntregar") {
        location.href = "maquinas_terminadas.html";
      }
    });
});
