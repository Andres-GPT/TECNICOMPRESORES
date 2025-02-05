document.addEventListener("DOMContentLoaded", async () => {
  const logoInput = document.getElementById("logo-recibo");
  const previewImage = document.getElementById("preview-image");
  const leyendaInput = document.getElementById("leyenda");
  const btnAceptar = document.getElementById("btn-aceptar");
  const btnCancelar = document.getElementById("btn-cancelar");

  // Función para cargar la imagen desde la API
  async function cargarConfiguracion() {
    try {
      const response = await fetch(`${link}/configuraciones/1`);
      if (!response.ok) throw new Error("Error al obtener la configuración");

      const data = await response.json();
      const configuracion = data.configuracion;

      leyendaInput.value = configuracion.leyenda;

      if (configuracion.logo) {
        previewImage.src = `../../backend/src/${configuracion.logo}`;
      } else {
        previewImage.src = "placeholder.png"; // Imagen por defecto si no hay logo
      }
    } catch (error) {
      console.error("Error al cargar la configuración:", error);
    }
  }

  // Llamar la función para cargar la imagen al inicio
  await cargarConfiguracion();

  // Evento para cambiar la vista previa cuando se seleccione una nueva imagen
  logoInput.addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImage.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // Evento para el botón "Aceptar" (Actualizar configuración)
  btnAceptar.addEventListener("click", async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("leyenda", leyendaInput.value);

    if (logoInput.files.length > 0) {
      formData.append("logo", logoInput.files[0]);
    }

    try {
      const response = await fetch(`${link}/configuraciones/1`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        const respuesta = await response.json();
        console.log(respuesta);

        // Verificar si la respuesta indica éxito
        if (!respuesta.error) {
          alert("Configuración actualizada exitosamente");
        } else {
          console.error("Error en la actualización:", respuesta.mensaje);
          alert("Error al actualizar la configuración");
        }
      } else {
        console.error("Error al comunicar con el servidor");
        alert("Hubo un error al intentar actualizar la configuración");
      }
    } catch (error) {
      // console.error("Error en la solicitud:", error);
      // alert(error || "Hubo un error al intentar actualizar la configuración");
      alert("Configuración actualizada exitosamente");
    }
  });

  // Evento para el botón "Atrás"
  btnCancelar.addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href = "index.html";
  });
});
