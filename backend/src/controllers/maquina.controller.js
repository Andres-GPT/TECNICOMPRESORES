import Maquina from "../models/maquina.js";
import Cliente from "../models/cliente.js";
import Procedimiento from "../models/procedimiento.js";
import NotaLlamada from "../models/nota_llamada.js";
import { Op } from "sequelize";

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

// Obtener las máquinas según el estado
export const getMaquinasEstado = async (req, res) => {
  try {
    const { estado } = req.params; // Obtener el estado desde la URL

    // Mapeo de estados según el número recibido
    const estadosValidos = {
      1: "pendiente por revisión",
      2: "en espera de aprobación",
      3: "en proceso",
      4: "pendiente por recoger",
      5: "terminado",
    };

    let whereCondition = {};

    if (estado == 0) {
      // Si estado es 0, filtrar todos los estados excepto "terminado"
      whereCondition = { estado: { [Op.not]: "terminado" } };
    } else if (estadosValidos[estado]) {
      // Si el estado es válido, filtrar por ese estado específico
      whereCondition = { estado: estadosValidos[estado] };
    } else {
      return res.status(400).json({
        error: true,
        mensaje: "Estado inválido. Usa un número entre 0 y 5.",
      });
    }

    // Consultar las máquinas con el estado correspondiente
    const maquinasRevision = await Maquina.findAll({
      where: whereCondition,
      include: {
        model: Cliente,
        as: "cliente_maquina", // Alias usado en la relación
        attributes: ["nombre", "apellido", "telefono", "correo", "direccion"], // Campos que se desean obtener del cliente
      },
    });

    // Devolver los datos
    res.status(200).json({
      error: false,
      mensaje: `Máquinas obtenidas correctamente`,
      maquinas: maquinasRevision.map((maquina) => ({
        id: maquina.id,
        cedula: maquina.id_cliente,
        nombre: maquina.cliente_maquina?.nombre || "N/A",
        apellido: maquina.cliente_maquina?.apellido || "N/A",
        telefono: maquina.cliente_maquina?.telefono || "N/A",
        correo: maquina.cliente_maquina?.correo || "N/A",
        direccion: maquina.cliente_maquina?.direccion || "N/A",
        descripcion: maquina.descripcion,
        estado: maquina.estado,
        observaciones: maquina.observacion,
        fecha: maquina.fecha_entrada
          ? new Date(maquina.fecha_entrada).toISOString().split("T")[0]
          : "Fecha no disponible",
        estante: maquina.estante,
        nivel: maquina.nivel,
      })),
    });
  } catch (error) {
    console.error("Error en getMaquinasEstado:", error);
    res.status(500).json({
      error: true,
      mensaje: "Error al obtener las máquinas",
      detalles: error.message,
    });
  }
};

//Editar una maquina
export const editMaquina = async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcion, observaciones, estado, estante, nivel } = req.body;

    //Verificar si existe la maquina
    const maquinaExistente = await Maquina.findByPk(id);

    if (!maquinaExistente) {
      res.status(404).json({ mensaje: "La maquina no existe" });
      return;
    }

    //Actualizar la maquina
    await maquinaExistente.update({
      descripcion,
      observacion: observaciones,
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

// Obtener maquinas en proceso, datos del cliente y procedimiento

export const getMaquinasProceso = async (req, res) => {
  try {
    const { estado } = req.params;

    const estadosValidos = {
      1: "pendiente por revisión",
      2: "en espera de aprobación",
      3: "en proceso",
      4: "pendiente por recoger",
      5: "terminado",
    };

    let whereCondition = {};

    if (estado == 0) {
      whereCondition = { estado: { [Op.not]: "terminado" } };
    } else if (estadosValidos[estado]) {
      whereCondition = { estado: estadosValidos[estado] };
    } else {
      return res.status(400).json({
        error: true,
        mensaje: "Estado inválido. Usa un número entre 0 y 5.",
      });
    }

    // Obtener las máquinas en proceso junto con los datos del cliente
    const maquinasEnProceso = await Maquina.findAll({
      where: whereCondition,
      include: {
        model: Cliente,
        as: "cliente_maquina",
        attributes: ["nombre", "apellido"],
      },
    });

    // Obtener los procedimientos de las máquinas
    const procedimientos = await Procedimiento.findAll({
      where: { id_maquina: maquinasEnProceso.map((maquina) => maquina.id) },
    });

    // Obtener las notas de llamadas de las máquinas
    const notas = await NotaLlamada.findAll({
      where: { id_maquina: maquinasEnProceso.map((maquina) => maquina.id) },
    });

    // Construcción de la respuesta final
    res.status(200).json({
      error: false,
      mensaje: `Máquinas obtenidas correctamente`,
      maquinas: maquinasEnProceso.map((maquina) => {
        const notaEncontrada = notas.find(
          (nota) => nota.id_maquina === maquina.id
        );

        return {
          id: maquina.id,
          cedula: maquina.id_cliente,
          nombre: maquina.cliente_maquina?.nombre || "N/A",
          apellido: maquina.cliente_maquina?.apellido || "N/A",
          descripcion: maquina.descripcion,
          estado: maquina.estado,
          observaciones: maquina.observacion,
          fecha: maquina.fecha_entrada
            ? new Date(maquina.fecha_entrada).toISOString().split("T")[0]
            : "Fecha no disponible",
          procedimiento:
            procedimientos.find(
              (procedimiento) => procedimiento.id_maquina === maquina.id
            )?.descripcion || "N/A",
          estante: maquina.estante,
          nivel: maquina.nivel,
          nota: notaEncontrada
            ? {
                nota: notaEncontrada.nota,
              }
            : {
                nota: "Sin notas",
              }, // Si no hay nota, se asigna null
        };
      }),
    });
  } catch (error) {
    console.error("Error en getMaquinasProceso:", error);
    res.status(500).json({
      error: true,
      mensaje: "Error al obtener las máquinas",
      detalles: error.message,
    });
  }
};
