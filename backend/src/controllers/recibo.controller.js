import Recibo from "../models/recibo.js";

// Crear un recibo
export const createRecibo = async (req, res) => {
  try {
    const { id_maquina } = req.body;
    //Crear el recibo
    const nuevoRecibo = await Recibo.create({
      id_maquina,
      id_configuracion: 1,
    });
    res.status(201).json({
      error: false,
      mensaje: "Recibo creado correctamente",
      recibo: nuevoRecibo,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear el recibo",
      error,
    });
    return;
  }
};

// Obtener un recibo
export const getRecibo = async (req, res) => {
  try {
    const { id } = req.params;

    //Obtener el recibo
    const recibo = await Recibo.findByPk(id);

    if (!recibo) {
      res.status(404).json({ mensaje: "El recibo no existe" });
      return;
    }

    res.status(200).json({
      error: false,
      mensaje: "Recibo obtenido correctamente",
      recibo: recibo,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener el recibo",
      error,
    });
    return;
  }
};