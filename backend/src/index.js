import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";

import db from "./database/db.js";
import clienteRoutes from "./routes/cliente.routes.js";
import maquinaRoutes from "./routes/maquina.routes.js";
import procedimientoRoutes from "./routes/procedimiento.routes.js";
import reciboRoutes from "./routes/recibo.routes.js";
import configuracionRoutes from "./routes/configuracion.routes.js";
import notasRoutes from "./routes/notas.routes.js";
import tecnicoRoutes from "./routes/tecnico.routes.js";

dotenv.config();

db.authenticate()
  .then(() => console.log("Databse connection successful"))
  .catch((error) => console.log("Connection error: ", error));

const app = express();

app.use( cors({
    origin: '*',
}));

const port = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Rutas
app.use("/clientes", clienteRoutes);
app.use("/maquinas", maquinaRoutes);
app.use("/procedimientos", procedimientoRoutes);
app.use("/recibos", reciboRoutes);
app.use("/configuraciones", configuracionRoutes);
app.use("/notas", notasRoutes);
app.use("/tecnicos", tecnicoRoutes);

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
