import Nota from "../models/nota_llamada.js";

// Crear una nota
export const createNota = async (req, res) => {
    try {

        const{id_maquina, nota} = req.body;
        //Crear la nota
        const nuevaNota = await Nota.create({
            id_maquina,
            nota,
        });
        res.status(201).json({
            error: false,
            mensaje: "Nota creada correctamente",
            nota: nuevaNota,
        });
    }
    catch (error) {
        res.status(500).json({
            mensaje: "Error al crear la nota",
            error,
        });
        return;
    }
};

// Editar una nota
export const editNota = async (req, res) => {
    try {
        const { id } = req.params;
        const { nota } = req.body;

        //Verificar si existe la nota
        const notaExistente = await Nota.findOne({where: {id_maquina:id}});

        if (!notaExistente) {
            res.status(404).json({ mensaje: "La nota no existe" });
            return;
        }

        //Actualizar la nota
        await notaExistente.update({
            nota,
        });

        res.status(200).json({
            error: false,
            mensaje: "Nota editada correctamente",
            nota: notaExistente,
        });
    }
    catch (error) {
        res.status(500).json({
            mensaje: "Error al editar la nota",
            error,
        });
        return;
    }
};

// Obtener una nota
export const getNota = async (req, res) => {
    try {
        const { id } = req.params;

        //Verificar si existe la nota
        const notaExistente = await Nota.findOne({where: {id_maquina:id}});

        if (!notaExistente) {
            res.status(404).json({ mensaje: "La nota no existe" });
            return;
        }

        res.status(200).json({
            error: false,
            mensaje: "Nota obtenida correctamente",
            nota: notaExistente,
        });
    }
    catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener la nota",
            error,
        });
        return;
    }
};