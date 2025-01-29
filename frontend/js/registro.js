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
  if (
    inputCedula.value === "" ||
    inputNombre.value === "" ||
    inputApellido.value === "" ||
    inputTelefono.value === "" ||
    inputCorreo.value === "" ||
    inputDescripcion.value === "" ||
    inputObservaciones.value === ""
  ) {
    alert("Todos los campos son obligatorios");
    return;
  }

  // Verificar si el cliente ya existe
  const clienteExistente = await obtenerCliente(inputCedula.value.trim());
  
  if (clienteExistente && clienteExistente.cliente) {
    // Si el cliente ya existe, verificar si los datos han cambiado
    const cliente = clienteExistente.cliente;
    const datosActualizados = {
      cedula: inputCedula.value,
      nombre: inputNombre.value,
      apellido: inputApellido.value,
      telefono: inputTelefono.value,
      correo: inputCorreo.value,
      direccion: inputDireccion.value,
    };

    const datosHanCambiado = Object.keys(datosActualizados).some(
      (key) => cliente[key] !== datosActualizados[key]
    );

    if (datosHanCambiado) {
      // Si los datos han cambiado, hacer un PUT para actualizar
      const clienteActualizado = await actualizarUsuario(datosActualizados);
      if (clienteActualizado.error) {
        alert("Error al actualizar el usuario");
        return;
      }
      console.log("Usuario actualizado:", clienteActualizado);
    }
  } else {
    // Si el cliente no existe, crearlo
    const usuarioNuevo = await crearUsuario({
      cedula: inputCedula.value,
      nombre: inputNombre.value,
      apellido: inputApellido.value,
      telefono: inputTelefono.value,
      correo: inputCorreo.value,
      direccion: inputDireccion.value,
    });

    if (usuarioNuevo.error) {
      alert("Error al registrar el usuario");
      return;
    }
    console.log("Usuario registrado:", usuarioNuevo);
  }

  // Registrar la máquina
  const maquinaNueva = await crearMaquina({
    id_cliente: inputCedula.value,
    descripcion: inputDescripcion.value,
    observacion: inputObservaciones.value,
  });

  if (maquinaNueva.error) {
    alert("Error al registrar la máquina");
    return;
  }

  alert("Usuario y máquina registrados correctamente");
  location.href = "index.html";
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
    if (cliente && cliente.cliente) { // Aseguramos que existe el cliente
      console.log("Datos del cliente:", cliente);
      
      // Asignar los valores al formulario
      document.getElementById("nombre").value = cliente.cliente.nombre || "";
      document.getElementById("apellido").value = cliente.cliente.apellido || "";
      document.getElementById("telefono").value = cliente.cliente.telefono || "";
      document.getElementById("correo").value = cliente.cliente.correo || "";
      document.getElementById("direccion").value = cliente.cliente.direccion || "";
    } else {
      console.log("No se encontró el cliente.");
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
