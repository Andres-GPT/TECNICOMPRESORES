import Cliente from "../models/cliente.js";
import { Op } from "sequelize";

//Registrar un cliente

export const registerCliente = async (req, res) => {
  try {
    const { cedula, nombre, telefono, correo, direccion } = req.body;

    //Verificar si existe el cliente
    const clienteExistente = await Cliente.findByPk(cedula);

    if (clienteExistente) {
      res.status(409).json({ mensaje: "El cliente ya existe" });
      return;
    }   

    //Crear el cliente

    const nuevoCliente = await Cliente.create({
      cedula,
      nombre,

      correo,
      telefono,
      direccion,
    });
    res.status(201).json({
      error: false,
      mensaje: "Cliente registrado correctamente",
      cliente: nuevoCliente,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al registrar el cliente",
      error,
    });
    return;
  }
};

//Editar un cliente
export const editCliente = async (req, res) => {
  try {
    const { cedula } = req.params;
    const { nombre, correo, telefono, direccion } = req.body;

    //Verificar si existe el cliente
    const clienteExistente = await Cliente.findByPk(cedula);

    if (!clienteExistente) {
      res.status(404).json({ mensaje: "El cliente no existe" });
      return;
    }
    //Actualizar el cliente
    await clienteExistente.update({
      nombre,

      correo,
      telefono,
      direccion,
    });

    res.status(200).json({
      error: false,
      mensaje: "Cliente editado correctamente",
      cliente: clienteExistente,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al editar el cliente",
      error,
    });
    return;
  }
};

//Eliminar un cliente
export const deleteCliente = async (req, res) => {
  try {
    const { cedula } = req.params;

    //Verificar si existe el cliente
    const clienteExistente = await Cliente.findByPk(cedula);

    if (!clienteExistente) {
      res.status(404).json({ mensaje: "El cliente no existe" });
      return;
    }

    //Eliminar el cliente
    await clienteExistente.destroy();

    res.status(200).json({
      error: false,
      mensaje: "Cliente eliminado correctamente",
      cliente: clienteExistente,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar el cliente",
      error,
    });
    return;
  }
};

//Obtener todos los clientes (con paginación y búsqueda)
export const getClientes = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "" } = req.query;
    
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    // Construir condición de búsqueda si existe
    const whereClause = search
      ? {
          [Op.or]: [
            { cedula: { [Op.like]: `%${search}%` } },
            { nombre: { [Op.like]: `%${search}%` } },

          ],
        }
      : {};

    // Obtener clientes con paginación
    const { count, rows } = await Cliente.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: offset,
      order: [['cedula', 'ASC']],
    });

    const totalPages = Math.ceil(count / parseInt(limit));

    res.status(200).json({
      error: false,
      mensaje: "Clientes obtenidos correctamente",
      clientes: rows,
      pagination: {
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
        totalItems: count,
        totalPages: totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener los clientes",
      error,
    });
    return;
  }
};

//Obtener un cliente
export const getCliente = async (req, res) => {
  try {
    const { cedula } = req.params;

    //Verificar si existe el cliente
    const clienteExistente = await Cliente.findByPk(cedula);

    if (!clienteExistente) {
      res.status(404).json({ mensaje: "El cliente no existe" });
      return;
    }

    res.status(200).json({
      error: false,
      mensaje: "Cliente obtenido correctamente",
      cliente: clienteExistente,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener el cliente",
      error,
    });
    return;
  }
};
