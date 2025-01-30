document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id"); // ID de la máquina
    const cedula = params.get("cedula"); // Cédula del usuario

    if (!id || !cedula) {
        console.error("Faltan parámetros en la URL");
        return;
    }

    const cedulaInput = document.getElementById("cedula");
    const nombreInput = document.getElementById("nombre");
    const apellidoInput = document.getElementById("apellido");
    const telefonoInput = document.getElementById("telefono");
    const correoInput = document.getElementById("correo");
    const direccionInput = document.getElementById("direccion");
    
    const descripcionInput = document.getElementById("descripcion");
    const observacionesInput = document.getElementById("observaciones");
    const procedimientoInput = document.getElementById("descripcion_procedimiento");
    const costoRevisionInput = document.getElementById("costo_revision");
    const costoProcedimientoInput = document.getElementById("costo_procedimiento");

    // Bloquear la edición de la cédula
    cedulaInput.value = cedula;
    cedulaInput.readOnly = true;

    try {
        // Obtener datos del cliente
        const clienteResponse = await fetch(`${link}/clientes/${cedula}`);
        const clienteData = await clienteResponse.json();
        console.log(clienteData.cliente);	

        if (clienteData.error) {
            console.error("Error obteniendo el cliente:", clienteData.mensaje);
        } else {
            nombreInput.value = clienteData.cliente.nombre || "";
            apellidoInput.value = clienteData.cliente.apellido || "";
            telefonoInput.value = clienteData.cliente.telefono || "";
            correoInput.value = clienteData.cliente.correo || "";
            direccionInput.value = clienteData.cliente.direccion || "";
        }

        // Obtener datos de la máquina
        const maquinaResponse = await fetch(`${link}/maquinas/${id}`);
        const maquinaData = await maquinaResponse.json();
        console.log(maquinaData.maquina);

        if (maquinaData.error) {
            console.error("Error obteniendo la máquina:", maquinaData.mensaje);
        } else {
            descripcionInput.value = maquinaData.maquina.descripcion || "";
            observacionesInput.value = maquinaData.maquina.observacion || "";
        }

    } catch (error) {
        console.error("Error al obtener los datos:", error);
    }

    // Manejo del formulario
    document.getElementById("form-register").addEventListener("submit", async (event) => {
        event.preventDefault();

        // Datos del cliente a actualizar
        const clienteActualizado = {
            nombre: nombreInput.value,
            apellido: apellidoInput.value,
            telefono: telefonoInput.value,
            correo: correoInput.value,
            direccion: direccionInput.value
        };

        // Datos de la máquina a actualizar
        const maquinaActualizada = {
            descripcion: descripcionInput.value,
            observaciones: observacionesInput.value
        };

        // Datos del procedimiento a registrar
        const procedimientoNuevo = {
            id_maquina: id,
            descripcion: procedimientoInput.value,
            costo_revision: costoRevisionInput.value,
            costo_procedimiento: costoProcedimientoInput.value
        };

        try {
            // Actualizar datos del cliente (PUT)
            await fetch(`${link}/clientes/${cedula}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(clienteActualizado)
            });

            // Actualizar datos de la máquina (PUT)
            await fetch(`${link}/maquinas/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(maquinaActualizada)
            });

            // Registrar procedimiento (POST)
            await fetch(`${link}/procedimientos`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(procedimientoNuevo)
            });

            alert("Datos actualizados y procedimiento registrado correctamente.");
            window.location.href = "index.html"; // Redirigir a inicio

        } catch (error) {
            console.error("Error al actualizar los datos:", error);
            alert("Hubo un error al actualizar los datos.");
        }
    });
});
