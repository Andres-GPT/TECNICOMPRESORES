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
app.use(express.urlencoded());

//Rutas
app.use("/clientes", clienteRoutes);
app.use("/maquinas", maquinaRoutes);
app.use("/procedimientos", procedimientoRoutes);
app.use("/recibos", reciboRoutes);
app.use("/configuraciones", configuracionRoutes);

// Error handling
app.use((error, req, res, next) => {
  console.error(error.message);
  res.status(500).json({ error: true, mensaje: error.message });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
