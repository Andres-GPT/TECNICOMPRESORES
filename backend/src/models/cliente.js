import Sequelize from "sequelize";
import sequelize from "../database/db.js";

//Modelo de cliente

const Cliente = sequelize.define(
  "clientes",
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
    correo: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false,
    },
    direccion: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "clientes",
    timestamps: false,
  }
);

export default Cliente;
