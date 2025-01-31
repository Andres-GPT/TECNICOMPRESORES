import { Router } from "express";
import {
  registerMaquina,
  editMaquina,
  deleteMaquina,
  getMaquinas,
  getMaquina,
  getMaquinasRevision,
  getMaquinasConfirmacion,
  getMaquinasFiltro,
} from "../controllers/maquina.controller.js";

const router = Router();

router.get("/", getMaquinas);
router.get("/revision", getMaquinasRevision);
router.get("/confirmacion", getMaquinasConfirmacion);
router.get("/:id", getMaquina);

router.post("/", registerMaquina);
router.post("/filtro", getMaquinasFiltro);

router.put("/:id", editMaquina);

router.delete("/:id", deleteMaquina);

export default router;