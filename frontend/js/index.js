document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch(`${link}/maquinas/`); // Reemplaza con tu endpoint real
        const data = await response.json();

        if (data.error) {
            console.error("Error obteniendo las máquinas:", data.mensaje);
            return;
        }

        // Contadores por estado
        const estados = {
            "pendiente por revisión": 0,
            "en espera de aprobación": 0, // Ajustar si el backend usa otro nombre
            "en proceso": 0,
            "pendiente por recoger": 0,
            "terminado": 0 // No se muestra en las tarjetas
        };

        // Contar las máquinas en cada estado
        data.maquinas.forEach(maquina => {
            if (estados.hasOwnProperty(maquina.estado)) {
                estados[maquina.estado]++;
            }
        });

        // Actualizar las tarjetas en la vista
        document.querySelector(".cards .card:nth-child(1) p").textContent = `#${estados["pendiente por revisión"]}`;
        document.querySelector(".cards .card:nth-child(2) p").textContent = `#${estados["en espera de aprobación"]}`;
        document.querySelector(".cards .card:nth-child(3) p").textContent = `#${estados["en proceso"]}`;
        document.querySelector(".cards .card:nth-child(4) p").textContent = `#${estados["pendiente por recoger"]}`;

    } catch (error) {
        console.error("Error al obtener los datos:", error);
    }
});
