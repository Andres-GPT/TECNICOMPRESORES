import Maquina from "../models/maquina.js";
import Cliente from "../models/cliente.js";

//Registrar una maquina

export const registerMaquina = async (req, res) => {
  try {
    const { descripcion, observacion, id_cliente } = req.body;
    //Crear la maquina
    const nuevaMaquina = await Maquina.create({
      descripcion,
      observacion,
      estado: "pendiente por revisión",
      estante: 0,
      nivel: 0,
      id_cliente,
    });
    res.status(201).json({
      error: false,
      mensaje: "Maquina registrada correctamente",
      maquina: nuevaMaquina,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al registrar la maquina",
      error,
    });
    return;
  }
};

// Obtener las maquinas de revisión con datos del cliente
export const getMaquinasRevision = async (req, res) => {
  try {
    const maquinasRevision = await Maquina.findAll({
      where: {
        estado: "pendiente por revisión",
      },
      include: {
        model: Cliente,
        as: "cliente_maquina", // Alias utilizado en la relación
        attributes: ["nombre", "apellido"], // Campos que deseas obtener del cliente
      },
    });

    // Si se encontraron máquinas, devolver los datos correctamente
    res.status(200).json({
      error: false,
      mensaje: "Máquinas de revisión obtenidas correctamente",
      maquinas: maquinasRevision.map((maquina) => ({
        id: maquina.id,
        cedula: maquina.id_cliente,
        nombre: maquina.cliente_maquina?.nombre || "N/A", // Acceso correcto
        apellido: maquina.cliente_maquina?.apellido || "N/A", // Acceso correcto
        descripcion: maquina.descripcion,
        observaciones: maquina.observacion,
        fecha: maquina.fecha_entrada
          ? new Date(maquina.fecha_entrada).toISOString().split("T")[0] // Formato YYYY-MM-DD
          : "Fecha no disponible",
      })),
    });
  } catch (error) {
    console.error("Error en getMaquinasRevision:", error);
    res.status(500).json({
      mensaje: "Error al obtener las maquinas de revisión",
      error,
    });
  }
};


import { Op } from "sequelize"; // Importa Op para usar operadores en la consulta

export const getMaquinasFiltro = async (req, res) => {
  try {
    const { cedula, fecha } = req.body;

    console.log("Cédula:", cedula);
    console.log("Fecha recibida:", fecha);

    // Definir condiciones de búsqueda dinámicamente
    let whereCondition = { estado: "pendiente por revisión" };

    if (cedula) {
      whereCondition.id_cliente = cedula;
    }

    if (fecha) {
      // Convertir la fecha recibida a un objeto Date
      const fechaInicio = new Date(fecha);
      fechaInicio.setUTCHours(0, 0, 0, 0); // Inicio del día en UTC
      const fechaFin = new Date(fecha);
      fechaFin.setUTCHours(23, 59, 59, 999); // Fin del día en UTC

      whereCondition.fecha_entrada = {
        [Op.between]: [fechaInicio, fechaFin], // Filtra dentro del rango de la fecha
      };
    }

    const maquinas = await Maquina.findAll({
      where: whereCondition,
      include: {
        model: Cliente,
        as: "cliente_maquina", // Alias utilizado en la relación
        attributes: ["nombre", "apellido"], // Campos que deseas obtener del cliente
      },
    });

    console.log("Máquinas encontradas:", maquinas.length);

    res.status(200).json({
      error: false,
      mensaje: "Máquinas de revisión obtenidas correctamente",
      maquinas: maquinas.map((maquina) => ({
        id: maquina.id,
        cedula: maquina.id_cliente,
        nombre: maquina.cliente_maquina?.nombre || "N/A", // Acceso correcto
        apellido: maquina.cliente_maquina?.apellido || "N/A", // Acceso correcto
        descripcion: maquina.descripcion,
        observaciones: maquina.observacion,
        fecha: maquina.fecha_entrada
          ? new Date(maquina.fecha_entrada).toISOString().split("T")[0] // Formato YYYY-MM-DD
          : "Fecha no disponible",
      })),
    });
  } catch (error) {
    console.error("Error en getMaquinasFiltro:", error);
    res.status(500).json({
      mensaje: "Error al obtener las máquinas de revisión",
      error,
    });
  }
};



//Editar una maquina
export const editMaquina = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, estante, nivel } = req.body;

    //Verificar si existe la maquina
    const maquinaExistente = await Maquina.findByPk(id);

    if (!maquinaExistente) {
      res.status(404).json({ mensaje: "La maquina no existe" });
      return;
    }

    //Actualizar la maquina
    await maquinaExistente.update({
      estado,
      estante,
      nivel,
    });

    res.status(200).json({
      error: false,
      mensaje: "Maquina editada correctamente",
      maquina: maquinaExistente,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al editar la maquina",
      error,
    });
    return;
  }
};

//Eliminar una maquina
export const deleteMaquina = async (req, res) => {
  try {
    const { id } = req.params;

    //Verificar si existe la maquina
    const maquinaExistente = await Maquina.findByPk(id);

    if (!maquinaExistente) {
      res.status(404).json({ mensaje: "La maquina no existe" });
      return;
    }

    //Eliminar la maquina
    await maquinaExistente.destroy();

    res.status(200).json({
      error: false,
      mensaje: "Maquina eliminada correctamente",
      maquina: maquinaExistente,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar la maquina",
      error,
    });
    return;
  }
};

//Obtener todas las maquinas
export const getMaquinas = async (req, res) => {
  try {
    const maquinas = await Maquina.findAll();

    res.status(200).json({
      error: false,
      mensaje: "Maquinas obtenidas correctamente",
      maquinas,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener las maquinas",
      error,
    });
    return;
  }
};

//Obtener una maquina
export const getMaquina = async (req, res) => {
  try {
    const { id } = req.params;

    //Verificar si existe la maquina
    const maquinaExistente = await Maquina.findByPk(id);

    if (!maquinaExistente) {
      res.status(404).json({ mensaje: "La maquina no existe" });
      return;
    }

    res.status(200).json({
      error: false,
      mensaje: "Maquina obtenida correctamente",
      maquina: maquinaExistente,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener la maquina",
      error,
    });
    return;
  }
};
