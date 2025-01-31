import Sequelize from "sequelize";
import sequelize from "../database/db.js";
import Maquina from "./maquina.js";

//Modelo de procedimiento

const Procedimiento = sequelize.define(
  "procedimientos",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    descripcion: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    estado_cliente: {
      type: Sequelize.ENUM("aceptado", "rechazado", "pendiente"),
      allowNull: false,
      defaultValue: "pendiente",
    },
    costo_revision: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    costo_procedimiento: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    fecha_revision: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    id_maquina: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "procedimientos",
    timestamps: false,
  }
);

//Relacion con la id de maquina
Procedimiento.belongsTo(Maquina, {
  foreignKey: "id_maquina",
  targetkey: "id",
  as: "maquina_procedimiento",
});

export default Procedimiento;
