import { Router } from "express";

import {registerProcedimiento, editProcedimiento, deleteProcedimiento, getProcedimientos, getProcedimiento} from "../controllers/procedimiento.controller.js";

const router = Router();

router.post("/", registerProcedimiento);
router.put("/:id", editProcedimiento);
router.delete("/:id", deleteProcedimiento);
router.get("/", getProcedimientos);
router.get("/:id", getProcedimiento);

export default router;