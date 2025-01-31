import { Router } from "express";

import {registerProcedimiento, editProcedimiento, deleteProcedimiento, getProcedimientos, getProcedimiento, getProcedimientoCompleto} from "../controllers/procedimiento.controller.js";

const router = Router();

router.post("/", registerProcedimiento);
router.put("/:id", editProcedimiento);
router.delete("/:id", deleteProcedimiento);
router.get("/", getProcedimientos);
router.get("/:id", getProcedimiento);
router.get("/completo/:id", getProcedimientoCompleto);

export default router;