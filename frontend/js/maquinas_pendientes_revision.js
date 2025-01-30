document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch(`${link}/maquinas/revision`); // Reemplaza con tu endpoint real
        const data = await response.json();

        console.log("HOLA");
        console.log(data.maquinas);

        if (data.error) {
            console.error("Error obteniendo las máquinas:", data.mensaje);
            return;
        }

        // Seleccionar el tbody de la tabla
        const tbody = document.querySelector(".table-custom tbody");

        if (!tbody) {
            console.error("No se encontró el tbody de la tabla.");
            return;
        }

        // Crear una variable para almacenar el HTML de las filas
        let filas = '';

        // Iterar sobre las máquinas y crear el HTML para cada fila
        data.maquinas.forEach(maquina => {
            filas += `
                <tr>
                    <th scope="row">${maquina.id}</th>
                    <td>${maquina.cedula}</td>
                    <td>${maquina.nombre}</td>
                    <td>${maquina.apellido}</td>
                    <td>${maquina.descripcion}</td>
                    <td>${maquina.observaciones}</td>
                    <td>${maquina.fecha}</td>
                </tr>
            `;
        });

        // Insertar todas las filas generadas en el tbody
        tbody.innerHTML = filas;

    } catch (error) {
        console.error("Error al obtener los datos:", error);
    }
});
