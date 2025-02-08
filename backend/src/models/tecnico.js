import Sequelize from "sequelize";
import sequelize from "../database/db.js";

//Modelo de tecnico

const Tecnico = sequelize.define(
  "tecnicos",
  {
    cedula: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    nombre: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    apellido: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    telefono: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    estado: {
      type: Sequelize.ENUM("activo", "inactivo"),
      allowNull: false,
      defaultValue: "activo",
    },
  },
  {
    tableName: "tecnicos",
    timestamps: false,
  }
);

export default Tecnico;
