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

        const tbody = document.querySelector(".table-custom tbody");

        if (!tbody) {
            console.error("No se encontró el tbody de la tabla.");
            return;
        }

        let filas = '';

        data.maquinas.forEach(maquina => {
            filas += `
                <tr data-id="${maquina.id}" data-cedula="${maquina.cedula}">
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

        tbody.innerHTML = filas;

        // Agregar evento de clic a cada fila
        document.querySelectorAll(".table-custom tbody tr").forEach(row => {
            row.addEventListener("click", function() {
                const id = this.getAttribute("data-id");
                const cedula = this.getAttribute("data-cedula");
                window.location.href = `revision_de_maquina.html?id=${id}&cedula=${cedula}`;
            });
        });

    } catch (error) {
        console.error("Error al obtener los datos:", error);
    }
});
