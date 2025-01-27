import { Router } from "express";
import {
  registerMaquina,
  editMaquina,
  deleteMaquina,
  getMaquinas,
  getMaquina,
} from "../controllers/maquina.controller.js";

const router = Router();

router.get("/", getMaquinas);
router.get("/:id", getMaquina);

router.post("/", registerMaquina);

router.put("/:id", editMaquina);

router.delete("/:id", deleteMaquina);

export default router;