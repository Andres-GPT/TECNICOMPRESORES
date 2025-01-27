import { Router } from "express";

import {registerProcedimiento, editProcedimiento, deleteProcedimiento, getProcedimientos, getProcedimiento} from "../controllers/procedimiento.controller.js";

const router = Router();

router.post("/procedimiento", registerProcedimiento);
router.put("/procedimiento/:id", editProcedimiento);
router.delete("/procedimiento/:id", deleteProcedimiento);
router.get("/procedimientos", getProcedimientos);
router.get("/procedimiento/:id", getProcedimiento);

export default router;