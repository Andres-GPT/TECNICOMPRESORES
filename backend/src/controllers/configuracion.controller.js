import Configuracion from "../models/configuracion.js";
import fs from "fs";
import path from "path";

// Crear una configuración
export const createConfiguracion = async (req, res) => {
  try {
    const { leyenda } = req.body;

    let logo = null;

    if (req.file) {
      logo = `/uploads/${req.file.filename}`; // Ruta de la imagen
    }

    // Verificar si ya existe una configuración
    const existeConfiguracion = await Configuracion.findOne();

    if (existeConfiguracion) {
      return res.status(400).json({
        mensaje: "Ya existe una configuración. Solo puedes editarla.",
      });
    }

    // Crear la configuración
    const nuevaConfiguracion = await Configuracion.create({ logo, leyenda });

    res.status(201).json({
      error: false,
      mensaje: "Configuración creada correctamente",
      configuracion: nuevaConfiguracion,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear la configuración", error });
  }
};

// Editar una configuración
export const editConfiguracion = async (req, res) => {
  try {
    const { id } = req.params;
    const { leyenda } = req.body;

    // Obtener la configuración existente
    const configuracion = await Configuracion.findByPk(id);
    if (!configuracion) {
      return res.status(404).json({ mensaje: "La configuración no existe" });
    }

    let logo = configuracion.logo; // Conservar el logo actual si no se sube una nueva imagen

    // Si se sube una nueva imagen, eliminar la anterior
    if (req.file) {
      logo = `/uploads/${req.file.filename}`; // Guardar la nueva imagen

      // Eliminar la imagen anterior si existía
      if (configuracion.logo) {
        const imagePath = path.join(
          process.cwd(),
          "src/uploads",
          path.basename(configuracion.logo)
        );
        try {
          await fs.promises.unlink(imagePath);
        } catch (err) {
          console.error("Error eliminando la imagen anterior:", err);
          // No detenemos la ejecución si falla la eliminación de la imagen anterior
        }
      }
    }

    // Actualizar la configuración
    await configuracion.update({ logo, leyenda });

    // Enviar respuesta exitosa
    res.status(200).json({
      error: false,
      mensaje: "Configuración editada correctamente",      
    });
  } catch (error) {
    console.error("Error en editConfiguracion:", error);
    res.status(500).json({
      mensaje: "Error al editar la configuración",
      error: error.message, // Envía solo el mensaje de error para evitar problemas con objetos complejos
    });
  }
};
// Obtener una configuración
export const getConfiguracion = async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener la configuración
    const configuracion = await Configuracion.findByPk(id);

    if (!configuracion) {
      return res.status(404).json({ mensaje: "La configuración no existe" });
    }

    res.status(200).json({
      error: false,
      mensaje: "Configuración obtenida correctamente",
      configuracion,
    });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener la configuración", error });
  }
};
