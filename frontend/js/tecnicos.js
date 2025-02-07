const inputCedula = document.getElementById("cedula");

let tecnicosData = []; // Se almacenarán los datos obtenidos de la API

async function mostrarUsuarios() {
  document.addEventListener("DOMContentLoaded", async () => {
    try {
      const response = await fetch(`${link}/tecnicos`); // Reemplaza con tu endpoint real
      const data = await response.json();
      console.log(data);

      if (data.error) {
        console.error("Error obteniendo los tecnicos:", data.mensaje);
        return;
      }

      // Guardamos los datos en la variable global
      tecnicosData = data.tecnicos.map((tecnico) => ({
        cedula: tecnico.cedula,
        nombre: tecnico.nombre,
        apellido: tecnico.apellido,
        telefono: tecnico.telefono,
      }));

      renderizarTabla(tecnicosData); // Llenamos la tabla con todos los datos
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  });
}

function renderizarTabla(data) {
  const tbody = document.querySelector(".table-custom tbody");

  if (!tbody) {
    console.error("No se encontró el tbody de la tabla.");
    return;
  }

  let filas = "";

  data.forEach((maquina) => {
    filas += `
      <tr data-cedula="${maquina.cedula}">
          <td>${maquina.cedula}</td>
          <td>${maquina.nombre}</td>
          <td>${maquina.apellido}</td>
          <td>${maquina.telefono}</td>          
      </tr>
    `;
  });

  tbody.innerHTML = filas;

  // Agregar evento de clic a cada fila
  document.querySelectorAll(".table-custom tbody tr").forEach((row) => {
    row.addEventListener("click", function () {
      {
        const cedula = this.getAttribute("data-cedula");
        window.location.href = `editar_tecnico.html?cedula=${cedula}`;
      }
    });
  });
}
// Filtrar por Cédula
function filtroCedula() {
  const cedula = inputCedula.value.trim();
  if (!cedula) {
    renderizarTabla(tecnicosData); // Si está vacío, mostrar todos los datos
    return;
  }
  const tecnicosFiltradas = tecnicosData.filter(
    (maquina) => maquina.cedula == cedula
  );
  renderizarTabla(tecnicosFiltradas);
}

// Escuchar Enter en los campos de filtro
inputCedula.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    filtroCedula();
  }
});

// Inicializar la carga de datos
mostrarUsuarios();
