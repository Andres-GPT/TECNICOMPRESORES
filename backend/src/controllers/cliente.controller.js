import Cliente from "../models/cliente.js";

//Registrar un cliente

export const registerCliente = async (req, res) => {
  try {
    const { cedula, nombre, apellido, correo, telefono, direccion } = req.body;
    console.log("bodyCliente", req.body);

    //Verificar si existe el cliente
    const clienteExistente = await Cliente.findByPk(cedula);

    if (clienteExistente) {
      res.status(409).json({ mensaje: "El cliente ya existe" });
      return;
    }

    //Verificar si el email existe
    const emailExistente = await Cliente.findOne({ where: { correo } });

    if (emailExistente) {
      res.status(409).json({ mensaje: "El email ya existe" });
      return;
    }

    //Crear el cliente

    const nuevoCliente = await Cliente.create({
      cedula,
      nombre,
      apellido,
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
    const { nombre, apellido, correo, telefono, direccion } = req.body;

    //Verificar si existe el cliente
    const clienteExistente = await Cliente.findByPk(cedula);

    if (!clienteExistente) {
      res.status(404).json({ mensaje: "El cliente no existe" });
      return;
    }
    //Actualizar el cliente
    await clienteExistente.update({
      nombre,
      apellido,
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

//Obtener todos los clientes
export const getClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll();

    res.status(200).json({
      error: false,
      mensaje: "Clientes obtenidos correctamente",
      clientes,
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
