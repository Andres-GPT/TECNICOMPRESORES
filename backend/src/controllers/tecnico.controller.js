import Tecnico from "../models/tecnico.js";

//Registrar un tecnico

export const registerTecnico = async (req, res) => {
  try {
    const { cedula, nombre, apellido, telefono } = req.body;

    //Verificar si existe el tecnico
    const tecnicoExistente = await Tecnico.findByPk(cedula);

    if (tecnicoExistente) {
      res.status(409).json({ mensaje: "El tecnico ya existe" });
      return;
    }

    //Crear el tecnico

    const nuevoTecnico = await Tecnico.create({
      cedula,
      nombre,
      apellido,
      telefono,
    });
    res.status(201).json({
      error: false,
      mensaje: "Tecnico registrado correctamente",
      tecnico: nuevoTecnico,
    });
  } catch (error) {
    res.status(500).json({ error: true, mensaje: error.message });
  }
};

//Obtener un tecnico
export const getTecnico = async (req, res) => {
  try {
    const { cedula } = req.params;

    //Verificar si existe el tecnico
    const tecnicoExistente = await Tecnico.findByPk(cedula);

    if (!tecnicoExistente) {
      res.status(404).json({ mensaje: "El tecnico no existe" });
      return;
    }

    res.status(200).json({
      error: false,
      mensaje: "El tecnico se encuentra",
      tecnico: tecnicoExistente,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener el tecnico",
      error,
    });
    return;
  }
};

//Editar un tecnico
export const editTecnico = async (req, res) => {
  try {
    const { cedula } = req.params;
    const { nombre, apellido, telefono } = req.body;

    //Verificar si existe el tecnico
    const tecnicoExistente = await Tecnico.findByPk(cedula);

    if (!tecnicoExistente) {
      res.status(404).json({ mensaje: "El tecnico no existe" });
      return;
    }

    //Actualizar el tecnico
    await tecnicoExistente.update({
      nombre,
      apellido,
      telefono,
      estado: "activo",
    });

    res.status(200).json({
      error: false,
      mensaje: "Tecnico editado correctamente",
      tecnico: tecnicoExistente,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al editar el tecnico",
      error,
    });
    return;
  }
};

//Eliminar un tecnico
export const deleteTecnico = async (req, res) => {
  try {
    const { cedula } = req.params;

    //Verificar si existe el tecnico
    const tecnicoExistente = await Tecnico.findByPk(cedula);

    if (!tecnicoExistente) {
      res.status(404).json({ mensaje: "El tecnico no existe" });
      return;
    }

    // desactivar el tecnico
    await tecnicoExistente.update({ estado: "inactivo" });

    res.status(200).json({
      error: false,
      mensaje: "Tecnico eliminado correctamente",
      tecnico: tecnicoExistente,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar el tecnico",
      error,
    });
    return;
  }
};

//Obtener todos los tecnicos
export const getTecnicos = async (req, res) => {
  try {
    const tecnicos = await Tecnico.findAll();

    res.status(200).json({
      error: false,
      mensaje: "Tecnicos obtenidos correctamente",
      tecnicos,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener los tecnicos",
      error,
    });
    return;
  }
};