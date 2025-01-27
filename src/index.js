import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";

import db from "./database/db.js";
import clienteRoutes from "./routes/cliente.routes.js";

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
