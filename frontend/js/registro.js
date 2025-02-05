const formRegister = document.getElementById("form-register");
const inputCedula = document.getElementById("cedula");
const inputNombre = document.getElementById("nombre");
const inputApellido = document.getElementById("apellido");
const inputTelefono = document.getElementById("telefono");
const inputCorreo = document.getElementById("correo");
const inputDireccion = document.getElementById("direccion");
const inputDescripcion = document.getElementById("descripcion");
const inputObservaciones = document.getElementById("observaciones");

formRegister.addEventListener("submit", validarFormulario);

async function validarFormulario(event) {
  event.preventDefault();

  // Validar que ningún campo esté vacío
  if (
    !inputCedula.value.trim() ||
    !inputNombre.value.trim() ||
    !inputApellido.value.trim() ||
    !inputTelefono.value.trim() ||
    !inputCorreo.value.trim() ||
    !inputDireccion.value.trim() ||
    !inputDescripcion.value.trim() ||
    !inputObservaciones.value.trim()
  ) {
    alert("Todos los campos son obligatorios");
    return;
  }

  // Validar que cédula y teléfono sean números
  if (isNaN(inputCedula.value) || isNaN(inputTelefono.value)) {
    alert("Cédula y teléfono deben ser valores numéricos");
    return;
  }

  // Validar formato del correo
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(inputCorreo.value.trim())) {
    alert("Correo inválido");
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
        apellido: inputApellido.value.trim(),
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
        apellido: inputApellido.value.trim(),
        telefono: inputTelefono.value.trim(),
        correo: inputCorreo.value.trim(),
        direccion: inputDireccion.value.trim(),
      });

      if (usuarioNuevo.error) throw new Error("Error al registrar el usuario");
    }

    // Registrar la máquina
    const maquinaNueva = await crearMaquina({
      id_cliente: clienteExistente?.cliente?.id || inputCedula.value.trim(),
      descripcion: inputDescripcion.value.trim(),
      observacion: inputObservaciones.value.trim(),
    });

    if (maquinaNueva.error) throw new Error("Error al registrar la máquina");

    // Fecha
    const fechaActual = new Date();
    const fechaFormateada = fechaActual.toISOString().split("T")[0];

    const reciboDatos = {
      cedula: inputCedula.value.trim(),
      nombre: inputNombre.value.trim(),
      apellido: inputApellido.value.trim(),
      telefono: inputTelefono.value.trim(),
      correo: inputCorreo.value.trim(),
      direccion: inputDireccion.value.trim(),
      descripcion: inputDescripcion.value.trim(),
      observaciones: inputObservaciones.value.trim(),
      fecha: fechaFormateada,
    };

    sessionStorage.setItem("reciboDatos", JSON.stringify(reciboDatos));
    alert("Usuario y máquina registrados correctamente");
    location.href = "recibo_registro.html";
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

async function crearUsuario(data) {
  try {
    const body = JSON.stringify(data);
    const response = await fetch(`${link}/clientes`, {
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
      document.getElementById("apellido").value =
        cliente.cliente.apellido || "";
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
  document.getElementById("apellido").value = "";
  document.getElementById("telefono").value = "";
  document.getElementById("correo").value = "";
  document.getElementById("direccion").value = "";
}


// Validar cédula en tiempo real
inputCedula.addEventListener("input", function () {
  if (this.value.length > 11) {
    this.value = this.value.slice(0, 11);
    document.getElementById("cedula-error").style.display = "block";
  } else {
    document.getElementById("cedula-error").style.display = "none";
  }
});

// Validar teléfono en tiempo real
inputTelefono.addEventListener("input", function () {
  if (this.value.length > 10) {
    this.value = this.value.slice(0, 10);
    document.getElementById("telefono-error").style.display = "block";
  } else {
    document.getElementById("telefono-error").style.display = "none";
  }
});
