import { Router } from "express";
import {
    createNota,
    editNota,
    getNota,
} from "../controllers/nota.controller.js";

const router = Router();

router.post("/", createNota);

router.put("/:id", editNota);

router.get("/:id", getNota);

export default router;