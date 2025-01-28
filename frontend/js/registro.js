//Registrar el usuario y la máquina

const formRegister = document.getElementById("form-register");
const inputCedula = document.getElementById("cedula");
const inputNombre = document.getElementById("nombre");
const inputApellido = document.getElementById("apellido");
const inputTelefono = document.getElementById("telefono");
const inputCorreo = document.getElementById("correo");
const inputDireccion = document.getElementById("direccion");
const inputDescripcion = document.getElementById("descripcion");
const inputObservaciones = document.getElementById("observaciones");
const inputFecha = document.getElementById("fecha");

const link = "http://localhost:4444";

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
    inputObservaciones.value === "" ||
    inputFecha.value === ""
  ) {
    alert("Todos los campos son obligatorios");
    return;
  }

  const usuarioNuevo = await crearUsuario({
    cedula: inputCedula.value,
    nombre: inputNombre.value,
    apellido: inputApellido.value,
    telefono: inputTelefono.value,
    correo: inputCorreo.value,
    direccion: inputDireccion.value,
  });

  const maquinaNueva = await crearMaquina({
    id_cliente: inputCedula.value,
    descripcion: inputDescripcion.value,
    observacion: inputObservaciones.value
  });

  console.log(usuarioNuevo);
  console.log(maquinaNueva);

  if (usuarioNuevo.error || maquinaNueva.error) {
    alert("Error al registrar el usuario o la máquina");
    return;
  }
  alert("Usuario y máquina registrados correctamente");
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