import { Router } from "express";
import {
  createRecibo,
  getRecibo,
} from "../controllers/recibo.controller.js";

const router = Router();

router.post("/", createRecibo);

router.get("/:id", getRecibo);

export default router;