import { Router } from "express";
import {
  registerCliente,
  editCliente,
  deleteCliente,
  getClientes,
  getCliente,
} from "../controllers/cliente.controller.js";

const router = Router();

//ruta de prueba
router.get("/test", (req, res) => {
  console.log("Prueba");
  res.send("Prueba");
});

router.get("/", getClientes);
router.get("/:cedula", getCliente);

router.post("/", registerCliente);

router.put("/:cedula", editCliente);

router.delete("/:cedula", deleteCliente);

export default router;
