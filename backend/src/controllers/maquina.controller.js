import Maquina from "../models/maquina.js";

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