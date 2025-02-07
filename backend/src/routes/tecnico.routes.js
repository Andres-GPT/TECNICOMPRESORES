import { Router } from "express";
import {
  registerTecnico,
  getTecnico,
  editTecnico,
  deleteTecnico,
  getTecnicos,
} from "../controllers/tecnico.controller.js";

const router = Router();

//Registrar un tecnico
router.post("/", registerTecnico);

//Obtener un tecnico
router.get("/:cedula", getTecnico);

//Editar un tecnico
router.put("/:cedula", editTecnico);

//Eliminar un tecnico
router.delete("/:cedula", deleteTecnico);

//Obtener todos los tecnicos
router.get("/", getTecnicos);

export default router;