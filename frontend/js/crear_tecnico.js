const formRegister = document.getElementById("form-register");
const inputCedula = document.getElementById("cedula");
const inputNombre = document.getElementById("nombre");
const inputApellido = document.getElementById("apellido");
const inputTelefono = document.getElementById("telefono");

// Evento del formulario
formRegister.addEventListener("submit", validarFormulario);

async function validarFormulario(event) {
  event.preventDefault();

  // Validación de campos vacíos
  const campos = [inputCedula, inputNombre, inputApellido, inputTelefono];
  if (campos.some((campo) => !campo.value.trim())) {
    mostrarModal("Todos los campos son obligatorios");
    return;
  }

  // Validación de que sean solo números
  const soloNumeros = /^\d+$/;
  if (
    !soloNumeros.test(inputCedula.value) ||
    !soloNumeros.test(inputTelefono.value)
  ) {
    mostrarModal("Cédula y teléfono deben ser valores numéricos");
    return;
  }

  // Crear usuario directamente sin verificar existencia
  await crearUsuario({
    cedula: inputCedula.value.trim(),
    nombre: inputNombre.value.trim(),
    apellido: inputApellido.value.trim(),
    telefono: inputTelefono.value.trim(),
  });
}

function mostrarModal(mensaje, callback) {
  const modal = document.getElementById("modal-confirmacion");
  const modalMensaje = document.getElementById("modal-mensaje");
  const btnCerrar = document.getElementById("modal-cerrar");

  modalMensaje.textContent = mensaje;
  modal.style.display = "flex";

  btnCerrar.onclick = function () {
    modal.style.display = "none";
    if (callback) callback();
    location.href = "tecnicos.html";
  };
}

async function crearUsuario(data) {
  try {
    const response = await fetch(`${link}/tecnicos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.mensaje || "Error al registrar el usuario");
    }

    mostrarModal("Técnico registrado con éxito", () => formRegister.reset());
    return json;
  } catch (error) {
    mostrarModal(error.message);
    return { error: true, mensaje: error.message };
  }
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

// validar nombre en tiempo real
inputNombre.addEventListener("input", function () {
  if (this.value.length > 30) {
    this.value = this.value.slice(0, 30);
    document.getElementById("nombre-error").style.display = "block";
  } else if (!this.value.match(/^[a-zA-Z]+$/)) {
    this.value = this.value.replace(/[0-9]/g, "");
    document.getElementById("nombre-error-letras").style.display = "block";
  } else {
    document.getElementById("nombre-error-letras").style.display = "none";
    document.getElementById("nombre-error").style.display = "none";
  }
});

// validar apellido en tiempo real
inputApellido.addEventListener("input", function () {
  if (this.value.length > 30) {
    this.value = this.value.slice(0, 30);
    document.getElementById("apellido-error").style.display = "block";
  } else if (!this.value.match(/^[a-zA-Z]+$/)) {
    this.value = this.value.replace(/[0-9]/g, "");
    document.getElementById("apellido-error-letras").style.display = "block";
  } else {
    document.getElementById("apellido-error").style.display = "none";
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
