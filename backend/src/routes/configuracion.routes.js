import express from "express";
import upload from "../middlewares/upload.js";
import {
  createConfiguracion,
  editConfiguracion,
  getConfiguracion,
} from "../controllers/configuracion.controller.js";

const router = express.Router();

router.post("/", upload.single("logo"), createConfiguracion);
router.put("/:id", upload.single("logo"), editConfiguracion);
router.get("/:id", getConfiguracion);

export default router;
