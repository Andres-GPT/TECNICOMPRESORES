const formRegister = document.getElementById("form-register");
const inputCedula = document.getElementById("cedula");
const inputNombre = document.getElementById("nombre");

const inputTelefono = document.getElementById("telefono");
const inputCorreo = document.getElementById("correo");
const inputDireccion = document.getElementById("direccion");
const inputDescripcion = document.getElementById("descripcion");
const inputObservaciones = document.getElementById("observaciones");
const inputFechaEntrada = document.getElementById("fecha_entrada");

formRegister.addEventListener("submit", validarFormulario);

async function validarFormulario(event) {
  event.preventDefault();

  // Validar que ningún campo esté vacío
  if (
    !inputCedula.value.trim() ||
    !inputNombre.value.trim() ||
    !inputDescripcion.value.trim() ||
    !inputObservaciones.value.trim() ||
    !inputFechaEntrada.value.trim()
  ) {
    showToast("Todos los campos son obligatorios", "warning");
    return;
  }

  // Validar que el teléfono sean números
  if (isNaN(inputTelefono.value)) {
    showToast("El teléfono deben ser valores numéricos", "warning");
    return;
  }

  // Validar formato del correo solo si no está vacío
  const correo = inputCorreo.value.trim();
  if (
    correo !== "" &&
    !correo.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
  ) {
    showToast("Correo inválido", "warning");
    return;
  }

  try {
    // Verificar si el cliente ya existe
    const clienteExistente = await obtenerCliente(inputCedula.value.trim());

    if (clienteExistente && clienteExistente.cliente) {
      const cliente = clienteExistente.cliente;
      const datosActualizados = {
        cedula: inputCedula.value.trim(),
        nombre: inputNombre.value.trim(),
        telefono: inputTelefono.value.trim(),
        correo: inputCorreo.value.trim(),
        direccion: inputDireccion.value.trim(),
      };

      const datosHanCambiado = Object.keys(datosActualizados).some(
        (key) => cliente[key] && cliente[key] !== datosActualizados[key]
      );

      if (datosHanCambiado) {
        const clienteActualizado = await actualizarUsuario(datosActualizados);
        if (clienteActualizado.error)
          throw new Error("Error al actualizar el usuario");
      }
    } else {
      // Si el cliente no existe, crearlo
      const usuarioNuevo = await crearUsuario({
        cedula: inputCedula.value.trim(),
        nombre: inputNombre.value.trim(),
        telefono: inputTelefono.value.trim(),
        correo: inputCorreo.value.trim(),
        direccion: inputDireccion.value.trim(),
      });

      if (usuarioNuevo.error) throw new Error("Error al registrar el usuario");
    }

    // Formatear la fecha de entrada
    const fechaEntrada = new Date(inputFechaEntrada.value);
    const fechaEntradaFormateada = fechaEntrada
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    // Registrar la máquina
    const maquinaNueva = await crearMaquina({
      id_cliente: clienteExistente?.cliente?.id || inputCedula.value.trim(),
      descripcion: inputDescripcion.value.trim(),
      observacion: inputObservaciones.value.trim(),
      fecha_entrada: fechaEntradaFormateada,
    });

    if (maquinaNueva.error) throw new Error("Error al registrar la máquina");
    const  res = await maquinaNueva.maquina;
    console.log("respuesta",res);

    // Fecha
    const fechaFormateada = fechaEntrada.toISOString().split("T")[0];

    const reciboDatos = {
      idMaquina: res.id,
      cedula: inputCedula.value.trim(),
      nombre: inputNombre.value.trim(),
      telefono: inputTelefono.value.trim(),
      correo: inputCorreo.value.trim(),
      direccion: inputDireccion.value.trim(),
      descripcion: inputDescripcion.value.trim(),
      observaciones: inputObservaciones.value.trim(),
      fecha: fechaFormateada,
    };

    sessionStorage.setItem("reciboDatos", JSON.stringify(reciboDatos));
    
    // Usar el modal existente
    mostrarModal("Usuario y máquina registrados correctamente.", () => {
      showToast("Generando recibo...", "info");
      setTimeout(() => {
        window.open("recibo_registro.html", "_blank");
        location.href = "index.html";
      }, 2000);
    });
  } catch (error) {
    console.error(error);
    showToast(error.message, "error");
  }
}

function mostrarModal(mensaje, callback) {
  const modal = document.getElementById("modal-confirmacion");
  const modalMensaje = document.getElementById("modal-mensaje");
  const btnCerrar = document.getElementById("modal-cerrar");

  // Añadir clase show si es necesaria para la animación del global.css
  modal.classList.add('show');
  
  modalMensaje.textContent = mensaje;
  modal.style.display = "flex";

  btnCerrar.onclick = function () {
    modal.style.display = "none";
    modal.classList.remove('show');
    if (callback) callback();
  };
}

async function crearUsuario(data) {
  try {
    const body = JSON.stringify(data);
    const response = await fetch(`${link}/clientes/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });
    if (!response.ok) {
      throw new Error("Error al registrar el usuario");
    }
    const json = await response.json();
    console.log("json", json);
    return json;
  } catch (error) {
    return {
      error: true,
      mensaje: "Error al registrar el usuario",
      error,
    };
  }
}

async function actualizarUsuario(data) {
  try {
    const body = JSON.stringify(data);
    const response = await fetch(`${link}/clientes/${data.cedula}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });
    if (!response.ok) {
      throw new Error("Error al actualizar el usuario");
    }
    const json = await response.json();
    return json;
  } catch (error) {
    return {
      error: true,
      mensaje: "Error al actualizar el usuario",
      error,
    };
  }
}

async function crearMaquina(data) {
  try {
    const body = JSON.stringify(data);
    const response = await fetch(`${link}/maquinas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });
    if (!response.ok) {
      throw new Error("Error al registrar la máquina");
    }
    const json = await response.json();
    return json;
  } catch (error) {
    return {
      error: true,
      mensaje: "Error al registrar la máquina",
      error,
    };
  }
}

async function obtenerCliente(cedula) {
  try {
    const response = await fetch(`${link}/clientes/${cedula}`);
    if (!response.ok) {
      throw new Error("Error al obtener el cliente");
    }
    const data = await response.json(); // Aquí se obtiene el JSON
    return data; // Retorna los datos del cliente
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

// Evento para rellenar el formulario con los datos del cliente
inputCedula.addEventListener("blur", async () => {
  const cedula = inputCedula.value.trim();
  if (cedula) {
    const cliente = await obtenerCliente(cedula);
    if (cliente && cliente.cliente) {
      // Aseguramos que existe el cliente

      // Asignar los valores al formulario
      document.getElementById("nombre").value = cliente.cliente.nombre || "";
      document.getElementById("telefono").value =
        cliente.cliente.telefono || "";
      document.getElementById("correo").value = cliente.cliente.correo || "";
      document.getElementById("direccion").value =
        cliente.cliente.direccion || "";
    } else {
      limpiarFormulario(); // Limpia los campos si no se encuentra cliente
    }
  }
});

// Función para limpiar el formulario si no se encuentra el cliente
function limpiarFormulario() {
  document.getElementById("nombre").value = "";
  document.getElementById("telefono").value = "";
  document.getElementById("correo").value = "";
  document.getElementById("direccion").value = "";
}

// Validar cédula en tiempo real
inputCedula.addEventListener("input", function () {
  if (this.value.length > 20) {
    this.value = this.value.slice(0, 20);
    document.getElementById("cedula-error").style.display = "block";
  } else {
    document.getElementById("cedula-error").style.display = "none";
  }
});

// validar nombre en tiempo real
inputNombre.addEventListener("input", function () {
  if (this.value.length > 128) {
    this.value = this.value.slice(0, 128);
    document.getElementById("nombre-error").style.display = "block";
  } else if (!this.value.match(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)) {
    this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
    document.getElementById("nombre-error-letras").style.display = "block";
  } else {
    document.getElementById("nombre-error-letras").style.display = "none";
    document.getElementById("nombre-error").style.display = "none";
  }
});



// Validar teléfono en tiempo real
inputTelefono.addEventListener("input", function () {
  if (this.value.length > 15) {
    this.value = this.value.slice(0, 15);
    document.getElementById("telefono-error").style.display = "block";
  } else {
    document.getElementById("telefono-error").style.display = "none";
  }
});

// Validar correo en tiempo real
inputCorreo.addEventListener("input", function () {
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
inputDireccion.addEventListener("input", function () {
  if (this.value.length > 100) {
    this.value = this.value.slice(0, 100);
    document.getElementById("direccion-error").style.display = "block";
  } else {
    document.getElementById("direccion-error").style.display = "none";
  }
});

// Validar descripción en tiempo real
inputDescripcion.addEventListener("input", function () {
  if (this.value.length > 255) {
    this.value = this.value.slice(0, 255);
    document.getElementById("descripcion-error").style.display = "block";
  } else {
    document.getElementById("descripcion-error").style.display = "none";
  }
});

// Validar observaciones en tiempo real
inputObservaciones.addEventListener("input", function () {
  if (this.value.length > 255) {
    this.value = this.value.slice(0, 255);
    document.getElementById("observaciones-error").style.display = "block";
  } else {
    document.getElementById("observaciones-error").style.display = "none";
  }
});
