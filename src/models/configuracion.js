import Sequelize from "sequelize";
import sequelize from "../database/db.js";

//Modelo de configuracion

const Configuracion = sequelize.define(
  "configuraciones",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    logo: {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    leyenda: {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    ultima_actualizacion: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    tableName: "configuraciones",
    timestamps: false,
  }
);

export default Configuracion;