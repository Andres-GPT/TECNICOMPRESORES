import Procedimiento from "../models/procedimiento.js";
import Maquina from "../models/maquina.js";
import Cliente from "../models/cliente.js";

//Registrar un procedimiento

export const registerProcedimiento = async (req, res) => {
  try {
    const { descripcion, costo_revision, costo_procedimiento, id_maquina } =
      req.body;

    //Crear el procedimiento
    const nuevoProcedimiento = await Procedimiento.create({
      descripcion,
      estado_cliente: "pendiente",
      costo_revision,
      costo_procedimiento,
      id_maquina,
    });
    res.status(201).json({
      error: false,
      mensaje: "Procedimiento registrado correctamente",
      procedimiento: nuevoProcedimiento,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al registrar el procedimiento",
      error,
    });
    return;
  }
};

// editar el estado de un procedimiento
export const editProcedimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcion, costo_revision, costo_procedimiento, estado } =
      req.body;

    console.log(req.body);

    //Obtener el procedimiento
    const procedimiento = await Procedimiento.findByPk(id);

    if (!procedimiento) {
      res.status(404).json({ mensaje: "El procedimiento no existe" });
      return;
    }

    //Editar el estado del procedimiento
    await procedimiento.update({
      descripcion,
      costo_revision,
      costo_procedimiento,
      estado_cliente: estado,
    });

    res.status(200).json({
      error: false,
      mensaje: "Procedimiento editado correctamente",
      procedimiento: procedimiento,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al editar el procedimiento",
      error,
    });
    return;
  }
};

//Eliminar un procedimiento
export const deleteProcedimiento = async (req, res) => {
  try {
    const { id } = req.params;

    //Obtener el procedimiento
    const procedimiento = await Procedimiento.findByPk(id);

    if (!procedimiento) {
      res.status(404).json({ mensaje: "El procedimiento no existe" });
      return;
    }

    //Eliminar el procedimiento
    await procedimiento.destroy();

    res.status(200).json({
      error: false,
      mensaje: "Procedimiento eliminado correctamente",
      procedimiento: procedimiento,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar el procedimiento",
      error,
    });
    return;
  }
};

//Obtener todos los procedimientos
export const getProcedimientos = async (req, res) => {
  try {
    const procedimientos = await Procedimiento.findAll();

    res.status(200).json({
      error: false,
      mensaje: "Procedimientos obtenidos correctamente",
      procedimientos,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener los procedimientos",
      error,
    });
    return;
  }
};

//Obtener un procedimiento
export const getProcedimiento = async (req, res) => {
  try {
    const { id } = req.params;

    //Obtener el procedimiento
    const procedimiento = await Procedimiento.findByPk(id);

    if (!procedimiento) {
      res.status(404).json({ mensaje: "El procedimiento no existe" });
      return;
    }

    res.status(200).json({
      error: false,
      mensaje: "Procedimiento obtenido correctamente",
      procedimiento: procedimiento,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener el procedimiento",
      error,
    });
    return;
  }
};

//Funcion para obtener el procedimiento de una máquina y los datos del cliente
export const getProcedimientoCompleto = async (req, res) => {
  try {
    const { id } = req.params; // Obtener el ID de la máquina

    //Obtener la maquina con los datos del cliente
    const maquina = await Maquina.findByPk(id, {
      include: {
        model: Cliente,
        as: "cliente_maquina", // Alias utilizado en la relación
        attributes: [
          "cedula",
          "nombre",
          "apellido",
          "telefono",
          "correo",
          "direccion",
        ], // Campos que deseas obtener del cliente
      },
    });

    if (!maquina) {
      res.status(404).json({ mensaje: "La máquina no existe" });
      return;
    }

    //obtener el procedimiento de la maquina
    const procedimiento = await Procedimiento.findOne({
      where: {
        id_maquina: id,
      },
    });

    if (!procedimiento) {
      res.status(404).json({ mensaje: "El procedimiento no existe" });
      return;
    }

    //jutar los datos del cliente, maquina y procedimiento
    res.status(200).json({
      error: false,
      mensaje: "Procedimiento obtenido correctamente",
      procedimiento: {
        ...procedimiento.toJSON(),
        maquina: maquina.toJSON(),
      },
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener el procedimiento",
      error,
    });
    return;
  }
};
